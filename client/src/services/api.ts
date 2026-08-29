import { ProductInspection, FlaggedViolation, ComplianceStatus } from '../types/metrology';
import { SAMPLE_INSPECTIONS } from '../utils/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiService = {
  loginUser: async (credentials: any) => {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Server not responding correctly. Did you restart the backend server?');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },

  signupUser: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error('Server not responding correctly. Did you restart the backend server?');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    return data;
  },
  getInspections: async (): Promise<ProductInspection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(SAMPLE_INSPECTIONS), 100);
    });
  },

  getInspectionById: async (id: string): Promise<ProductInspection | undefined> => {
    return SAMPLE_INSPECTIONS.find((item) => item.id === id);
  },

  getViolationsByCategory: async (categoryName: string): Promise<ProductInspection[]> => {
    return SAMPLE_INSPECTIONS.filter((item) => 
      item.violations.some((v) => v.category.toLowerCase() === categoryName.toLowerCase())
    );
  },

  analyzePackaging: async (images: string[]): Promise<ProductInspection> => {
    const formData = new FormData();
    const dataURLtoBlob = (dataurl: string) => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    images.forEach((img, i) => {
      formData.append('images', dataURLtoBlob(img), `image_${i}.jpg`);
    });

    const res = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to analyze packaging');
    }

    const data = await res.json();
    const product = data[0]; // Assuming one merged product returned

    const declarations = {
      manufacturer: !!product.manufacturer?.name || !!product.manufacturer?.address,
      netQuantity: !!product.net_quantity,
      mrp: !!product.mrp,
      mfgDate: !!product.manufacturing_date,
      consumerCare: !!product.customer_care?.phone || !!product.customer_care?.email,
    };

    const violations: FlaggedViolation[] = [];
    if (!declarations.manufacturer) {
      violations.push({
        id: 'v_mfr',
        title: 'Missing Manufacturer Details',
        category: 'Missing Declaration',
        fieldCategory: 'manufacturer',
        statusText: 'Not detected',
        requirement: 'Rule 6(1)(a) mandates Name and Address of the Manufacturer.',
        evidenceText: 'Front/Back images do not contain manufacturer information.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package.',
      });
    }
    if (!declarations.netQuantity) {
      violations.push({
        id: 'v_net',
        title: 'Missing Net Quantity',
        category: 'Quantity Related',
        fieldCategory: 'net_quantity',
        statusText: 'Not detected',
        requirement: 'Rule 6(1)(e) requires statement of Net Quantity.',
        evidenceText: 'Net quantity not found.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package.',
      });
    }
    if (!declarations.mrp) {
      violations.push({
        id: 'v_mrp',
        title: 'Missing MRP Declaration',
        category: 'MRP Related',
        fieldCategory: 'mrp',
        statusText: 'Not detected',
        requirement: 'Rule 6(1)(m) mandates Maximum Retail Price (Inclusive of all taxes).',
        evidenceText: 'MRP declaration not found.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package.',
      });
    } else if (product.mrp && !product.mrp.toLowerCase().includes('incl')) {
      violations.push({
        id: 'v_mrp_tax',
        title: 'MRP Missing Mandatory Tax Clause',
        category: 'MRP Related',
        fieldCategory: 'mrp',
        statusText: 'Missing "Incl. of all taxes"',
        requirement: 'Rule 6(1)(e) requires price statement to explicitly read "MRP ₹ XX.XX (Incl. of all taxes)".',
        evidenceText: `MRP printed as "${product.mrp}" without tax statement.`,
        evidenceImageSide: 'Back',
        recommendation: 'Issue advisory letter to manufacturer.',
      });
    }
    if (!declarations.mfgDate) {
      violations.push({
        id: 'v_mfg',
        title: 'Missing Date of Manufacture',
        category: 'Missing Declaration',
        fieldCategory: 'mfg_date',
        statusText: 'Not detected',
        requirement: 'Rule 6(1)(d) mandates month and year of manufacture or packing.',
        evidenceText: 'Date of manufacture not found.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package.',
      });
    }
    if (!declarations.consumerCare) {
      violations.push({
        id: 'v_cc',
        title: 'Missing Consumer Care Declaration',
        category: 'Missing Declaration',
        fieldCategory: 'consumer_care',
        statusText: 'Not detected',
        requirement: 'Consumer-care information (Name, Address, Telephone, Email) was not detected as mandated under Rule 6(2).',
        evidenceText: 'Package does not contain consumer grievance cell contact details.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package before taking enforcement action.',
      });
    }

    let overallStatus: ComplianceStatus = 'COMPLIANT';
    if (violations.length > 0) {
      overallStatus = violations.length > 2 ? 'POTENTIAL_VIOLATION' : 'NEEDS_REVIEW';
    }

    const newInspection: ProductInspection = {
      id: `insp-${Date.now()}`,
      productName: product.product_name || 'Unknown Product',
      brandName: product.brand_name || 'Unknown Brand',
      category: product.product_category || 'General',
      barcode: product.barcode || 'N/A',
      frontImage: images[0] || '',
      rawData: product,
      backImage: images[1] || images[0] || '',
      sideImage: images[2] || undefined,
      uploadedImages: images,
      timestamp: new Date().toISOString(),
      inspectorName: 'Inspector S. Verma',
      district: 'Pune District',
      confidenceScore: 88 + Math.floor(Math.random() * 10),
      overallStatus,
      declarations,
      boundingBoxes: [],
      violations,
    };

    return newInspection;
  }
};
