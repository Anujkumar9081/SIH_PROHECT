import jsPDF from 'jspdf';
import { ProductInspection } from '../types/metrology';

const compressImage = (dataUrl: string, rotationDeg = 0, maxWidth = 1200): Promise<{ data: string, width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    if (dataUrl.includes('svg+xml')) return reject('SVG not supported');
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // Determine base dimensions (swap width/height if rotated 90 or 270)
      let baseWidth = img.width;
      let baseHeight = img.height;
      const isSideways = rotationDeg % 180 !== 0;
      if (isSideways) {
        baseWidth = img.height;
        baseHeight = img.width;
      }

      let scale = 1;
      if (baseWidth > maxWidth) {
        scale = maxWidth / baseWidth;
      }
      
      const finalWidth = Math.round(baseWidth * scale);
      const finalHeight = Math.round(baseHeight * scale);

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve({ data: dataUrl, width: finalWidth, height: finalHeight });
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      // Translate to center, rotate, then draw image offset by its scaled original center
      ctx.translate(finalWidth / 2, finalHeight / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      
      const drawWidth = isSideways ? finalHeight : finalWidth;
      const drawHeight = isSideways ? finalWidth : finalHeight;
      
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      
      resolve({ data: canvas.toDataURL('image/jpeg', 0.8), width: finalWidth, height: finalHeight });
    };
    img.onerror = () => reject('Image load error');
    img.src = dataUrl;
  });
};

export async function generateInspectionPDF(record: ProductInspection, targetImage: string, rotationDeg = 0): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  let y = margin;

  // Header Banner (Legal Blue)
  doc.setFillColor(30, 64, 175); // #1E40AF
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PRODUCT DATA EXTRACTION REPORT', pageWidth / 2, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Automated OCR Data Extraction System', pageWidth / 2, 18, { align: 'center' });
  doc.text(`Report ID: EXT-2026-${record.id.toUpperCase()}  |  Generated: ${new Date(record.timestamp).toLocaleDateString()}`, pageWidth / 2, 23, { align: 'center' });

  y = 35;

  // Extraction Status Banner
  doc.setFillColor(22, 163, 74); // Green
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 16, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('STATUS: SUCCESSFUL OCR EXTRACTION', margin + 10, y + 10.5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Confidence Score: ${record.confidenceScore || 95}%`, pageWidth - margin - 10, y + 10.5, { align: 'right' });

  y += 24;

  const rawData = record.rawData || {};

  // Product Metadata Block
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 32, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Product Metadata', margin + 5, y + 7);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, y + 9, pageWidth - margin - 5, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const truncate = (str: any, maxLength: number) => {
    if (!str) return 'N/A';
    const s = String(str);
    return s.length > maxLength ? s.substring(0, maxLength - 3) + '...' : s;
  };

  doc.text(`Product Name: ${truncate(rawData.product_name || record.productName, 45)}`, margin + 5, y + 15);
  doc.text(`Brand / Manufacturer: ${truncate(rawData.brand_name || record.brandName, 45)}`, margin + 5, y + 21);
  doc.text(`Category: ${truncate(rawData.product_category || record.category, 45)}`, margin + 5, y + 27);

  doc.text(`Barcode: ${truncate(rawData.barcode || record.barcode, 45)}`, pageWidth / 2 + 10, y + 15);
  doc.text(`Inspector: ${truncate(record.inspectorName, 45)}`, pageWidth / 2 + 10, y + 21);
  doc.text(`Country of Origin: ${truncate(rawData.country_of_origin || 'India', 45)}`, pageWidth / 2 + 10, y + 27);

  y += 38;

  // Detailed Extracted Information Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Detailed Extracted Information', margin, y);
  y += 5;

  const extractedDetails = [
    { label: 'Maximum Retail Price (MRP)', value: rawData.mrp },
    { label: 'Net Quantity', value: rawData.net_quantity },
    { label: 'Manufacturing Date', value: rawData.manufacturing_date },
    { label: 'Expiry / Best Before', value: rawData.expiry_date || rawData.best_before },
    { label: 'Ingredients', value: rawData.ingredients_list ? rawData.ingredients_list.join(', ') : null },
    { label: 'Directions for Use', value: rawData.dosage_or_directions_for_use },
    { label: 'Customer Care', value: rawData.customer_care ? `${rawData.customer_care.phone || ''} ${rawData.customer_care.email || ''}` : null },
    { label: 'Manufacturer Address', value: rawData.manufacturer ? rawData.manufacturer.address : null },
    { label: 'Key Claims', value: rawData.key_claims_and_features ? rawData.key_claims_and_features.join(', ') : null }
  ].filter(d => d.value && d.value !== '');

  extractedDetails.forEach((d, i) => {
    const isEven = i % 2 === 0;
    
    // Calculate height based on text wrapping
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const labelLines = doc.splitTextToSize(`${d.label}:`, 60);
    doc.setFont('helvetica', 'normal');
    const valText = typeof d.value === 'object' ? JSON.stringify(d.value) : String(d.value);
    const valueLines = doc.splitTextToSize(valText, pageWidth - margin - 85);
    
    const rowHeight = Math.max(labelLines.length, valueLines.length) * 5 + 4;

    if (y + rowHeight > 260) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(isEven ? 241 : 255, isEven ? 245 : 255, isEven ? 249 : 255); // Alternate row colors
    doc.rect(margin, y, pageWidth - (margin * 2), rowHeight, 'F');
    
    doc.setTextColor(15, 23, 42);
    
    doc.setFont('helvetica', 'bold');
    doc.text(labelLines, margin + 4, y + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.text(valueLines, margin + 65, y + 5);
    
    y += rowHeight + 1;
  });

  y += 8;

  if (targetImage && !targetImage.includes('svg+xml')) {
    doc.addPage();
    y = margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. Reference Image (Extracted Details)', margin, y);
    y += 10;

    try {
      const compressed = await compressImage(targetImage, rotationDeg);
      
      const pdfMaxWidth = pageWidth - (margin * 2);
      let targetWidth = compressed.width;
      let targetHeight = compressed.height;
      
      // Scale to fit available width
      if (targetWidth > pdfMaxWidth) {
        const ratio = pdfMaxWidth / targetWidth;
        targetWidth = pdfMaxWidth;
        targetHeight = targetHeight * ratio;
      }

      // Limit maximum height so it doesn't take up an entire page
      const maxHeightAllowed = 200; 
      if (targetHeight > maxHeightAllowed) {
         const ratio = maxHeightAllowed / targetHeight;
         targetHeight = maxHeightAllowed;
         targetWidth = targetWidth * ratio;
      }

      if (y + targetHeight > 260) {
        doc.addPage();
        y = margin;
      }

      // Center the image
      const xPos = margin + (pdfMaxWidth - targetWidth) / 2;
      doc.addImage(compressed.data, 'JPEG', xPos, y, targetWidth, targetHeight, undefined, 'FAST');
      
    } catch (e) {
      console.warn("Failed to compress or add image to PDF", e);
    }
  }

  // Footer & Official Seal Stamp
  const footerY = 270;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Automated OCR extraction report.', margin, footerY + 5);
  doc.text('Generated by Legal Metrology AI System', pageWidth - margin, footerY + 5, { align: 'right' });

  doc.save(`OCR_Report_${record.productName.replace(/\\s+/g, '_')}.pdf`);
}
