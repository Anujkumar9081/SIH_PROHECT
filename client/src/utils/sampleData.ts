import { ProductInspection } from '../types/metrology';

// Helper SVG Generator for crisp visual placeholders
function createPackagingSvg(title: string, subtitle: string, color: string, badge: string): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <rect width="800" height="1000" fill="#F8FAFC"/>
    <rect x="40" y="40" width="720" height="920" rx="16" fill="${color}" stroke="#CBD5E1" stroke-width="4"/>
    <circle cx="400" cy="220" r="100" fill="#ffffff" opacity="0.2"/>
    <text x="400" y="210" font-family="sans-serif" font-size="42" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="400" y="260" font-family="sans-serif" font-size="22" fill="#E2E8F0" text-anchor="middle">${subtitle}</text>
    <rect x="280" y="310" width="240" height="40" rx="20" fill="#1E40AF"/>
    <text x="400" y="336" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${badge}</text>
    
    <!-- Packaging Declarations Card -->
    <rect x="80" y="420" width="640" height="480" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <text x="110" y="460" font-family="monospace" font-size="20" font-weight="bold" fill="#1E40AF">PRINCIPAL DISPLAY PANEL (PDP)</text>
    <line x1="110" y1="475" x2="690" y2="475" stroke="#E2E8F0" stroke-width="2"/>
    
    <text x="110" y="520" font-family="monospace" font-size="22" font-weight="bold" fill="#0F172A">MRP: ₹149.00 (Incl. of all taxes)</text>
    <text x="110" y="570" font-family="monospace" font-size="22" font-weight="bold" fill="#0F172A">NET QTY: 1 L</text>
    <text x="110" y="620" font-family="monospace" font-size="20" fill="#475569">MFD DATE: 08/2026</text>
    <text x="110" y="670" font-family="sans-serif" font-size="18" fill="#475569">Mfd By: ABC Foods India Pvt Ltd, Plot 42, MIDC Pune 411018</text>
    <text x="110" y="730" font-family="sans-serif" font-size="18" fill="#DC2626" font-weight="bold">Consumer Care: [NOT PRINTED / MISSING]</text>
    
    <!-- Barcode -->
    <rect x="520" y="780" width="160" height="90" fill="#FFFFFF" stroke="#CBD5E1" rx="4"/>
    <path d="M530 790v70M540 790v70M545 790v70M555 790v70M570 790v70M580 790v70M595 790v70M610 790v70M625 790v70M640 790v70M650 790v70M665 790v70" stroke="#000000" stroke-width="3"/>
    <text x="600" y="865" font-family="monospace" font-size="12" fill="#000000" text-anchor="middle">8901234567890</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_INSPECTIONS: ProductInspection[] = [
  {
    id: 'insp-001',
    productName: 'ABC Refined Sunflower Oil (1L)',
    brandName: 'ABC Foods',
    category: 'Edible Oils & Fats',
    barcode: '8901234567890',
    frontImage: createPackagingSvg('ABC OIL', 'Refined Sunflower Oil 1L', '#1E40AF', 'PURE SUNFLOWER'),
    backImage: createPackagingSvg('ABC OIL (BACK)', 'Declarations Panel', '#1E40AF', 'LEGAL METROLOGY'),
    sideImage: createPackagingSvg('ABC OIL (SIDE)', 'Nutrition Info', '#1E40AF', 'SIDE VIEW'),
    timestamp: '2026-08-28T09:30:00Z',
    inspectorName: 'Inspector S. Verma',
    district: 'Pune',
    confidenceScore: 91,
    overallStatus: 'NEEDS_REVIEW',
    declarations: {
      manufacturer: true,
      netQuantity: true,
      mrp: true,
      mfgDate: true,
      consumerCare: false,
    },
    boundingBoxes: [
      {
        id: 'b1',
        fieldCategory: 'mrp',
        label: 'MRP Declaration',
        x: 13.5,
        y: 49.5,
        width: 65,
        height: 5,
        extractedText: 'MRP: ₹149.00 (Incl. of all taxes)',
        isDetected: true,
        status: 'PASS',
      },
      {
        id: 'b2',
        fieldCategory: 'net_quantity',
        label: 'Net Quantity',
        x: 13.5,
        y: 54.5,
        width: 35,
        height: 4.5,
        extractedText: 'NET QTY: 1 L',
        isDetected: true,
        status: 'PASS',
      },
      {
        id: 'b3',
        fieldCategory: 'mfg_date',
        label: 'Mfg Date',
        x: 13.5,
        y: 59.5,
        width: 40,
        height: 4,
        extractedText: 'MFD DATE: 08/2026',
        isDetected: true,
        status: 'PASS',
      },
      {
        id: 'b4',
        fieldCategory: 'manufacturer',
        label: 'Manufacturer Address',
        x: 13.5,
        y: 64.5,
        width: 70,
        height: 5,
        extractedText: 'Mfd By: ABC Foods India Pvt Ltd, MIDC Pune 411018',
        isDetected: true,
        status: 'PASS',
      },
      {
        id: 'b5',
        fieldCategory: 'consumer_care',
        label: 'Consumer Care Cell',
        x: 13.5,
        y: 70.5,
        width: 70,
        height: 6,
        extractedText: '[NOT DETECTED / MISSING]',
        isDetected: false,
        status: 'FAIL',
      },
    ],
    violations: [
      {
        id: 'v1',
        title: 'Missing Consumer Care Declaration',
        category: 'Missing Declaration',
        fieldCategory: 'consumer_care',
        statusText: 'Not detected',
        requirement: 'Consumer-care information (Name, Address, Telephone, Email) was not detected in the provided package images as mandated under Rule 6(2).',
        evidenceText: 'Back-side image does not contain consumer grievance cell contact details.',
        evidenceImageSide: 'Back',
        recommendation: 'Verify the physical package before taking enforcement action or issuing a legal notice.',
      },
    ],
  },
  {
    id: 'insp-002',
    productName: 'XYZ Wheat Crunch Biscuits (200g)',
    brandName: 'XYZ Bakery',
    category: 'Biscuits & Snacks',
    barcode: '8909876543210',
    frontImage: createPackagingSvg('XYZ BISCUITS', 'Whole Wheat Fiber Crunch', '#0F172A', '100% WHEAT'),
    backImage: createPackagingSvg('XYZ BISCUITS (BACK)', 'Declarations Panel', '#0F172A', 'COMPLIANT'),
    timestamp: '2026-08-28T10:15:00Z',
    inspectorName: 'Inspector S. Verma',
    district: 'Mumbai',
    confidenceScore: 98,
    overallStatus: 'COMPLIANT',
    declarations: {
      manufacturer: true,
      netQuantity: true,
      mrp: true,
      mfgDate: true,
      consumerCare: true,
    },
    boundingBoxes: [
      {
        id: 'b201',
        fieldCategory: 'mrp',
        label: 'MRP Declaration',
        x: 13.5,
        y: 49.5,
        width: 60,
        height: 5,
        extractedText: 'MRP ₹30.00 (Incl. of all taxes)',
        isDetected: true,
        status: 'PASS',
      },
      {
        id: 'b202',
        fieldCategory: 'net_quantity',
        label: 'Net Quantity',
        x: 13.5,
        y: 54.5,
        width: 35,
        height: 4.5,
        extractedText: 'NET QTY: 200 g',
        isDetected: true,
        status: 'PASS',
      },
    ],
    violations: [],
  },
  {
    id: 'insp-003',
    productName: 'DEF Herbal Hygiene Soap (125g)',
    brandName: 'DEF Organics',
    category: 'Personal Care',
    barcode: '8904567890123',
    frontImage: createPackagingSvg('DEF SOAP', 'Natural Herbal Soap Bar', '#0284C7', 'NEEM & ALOE'),
    backImage: createPackagingSvg('DEF SOAP (BACK)', 'Declarations Panel', '#0284C7', 'NEEDS REVIEW'),
    timestamp: '2026-08-27T14:20:00Z',
    inspectorName: 'Inspector R. Kumar',
    district: 'Nashik',
    confidenceScore: 89,
    overallStatus: 'NEEDS_REVIEW',
    declarations: {
      manufacturer: true,
      netQuantity: true,
      mrp: false,
      mfgDate: true,
      consumerCare: true,
    },
    boundingBoxes: [
      {
        id: 'b301',
        fieldCategory: 'mrp',
        label: 'MRP Declaration',
        x: 13.5,
        y: 49.5,
        width: 50,
        height: 5,
        extractedText: 'MRP Rs 45.00',
        isDetected: true,
        status: 'WARNING',
      },
    ],
    violations: [
      {
        id: 'v301',
        title: 'MRP Missing Mandatory Tax Clause',
        category: 'MRP Related',
        fieldCategory: 'mrp',
        statusText: 'Missing "Incl. of all taxes"',
        requirement: 'Rule 6(1)(e) requires price statement to explicitly read "MRP ₹ XX.XX (Incl. of all taxes)".',
        evidenceText: 'MRP printed as "MRP Rs 45.00" without tax statement.',
        evidenceImageSide: 'Back',
        recommendation: 'Issue advisory letter to manufacturer to update printing plates.',
      },
    ],
  },
  {
    id: 'insp-004',
    productName: 'CleanMax Heavy Detergent Powder (1kg)',
    brandName: 'CleanMax',
    category: 'Household Care',
    barcode: '8906543210987',
    frontImage: createPackagingSvg('CLEANMAX POWDER', 'Active Wash Detergent 1kg', '#DC2626', 'HIGH EFFICIENCY'),
    backImage: createPackagingSvg('CLEANMAX (BACK)', 'Declarations Panel', '#DC2626', 'VIOLATION'),
    timestamp: '2026-08-26T16:00:00Z',
    inspectorName: 'Inspector R. Kumar',
    district: 'Nagpur',
    confidenceScore: 94,
    overallStatus: 'POTENTIAL_VIOLATION',
    declarations: {
      manufacturer: true,
      netQuantity: false,
      mrp: false,
      mfgDate: true,
      consumerCare: true,
    },
    boundingBoxes: [
      {
        id: 'b401',
        fieldCategory: 'mrp',
        label: 'MRP Declaration',
        x: 13.5,
        y: 49.5,
        width: 50,
        height: 4,
        extractedText: 'MRP ₹220.00',
        isDetected: true,
        status: 'FAIL',
      },
    ],
    violations: [
      {
        id: 'v401',
        title: 'Font Height Below Table I Threshold for Large PDP',
        category: 'Readability',
        fieldCategory: 'mrp',
        statusText: 'Font height 3.2mm < 4.0mm req',
        requirement: 'For PDP surface area > 500 cm², Table I mandates minimum font height of 4.0mm.',
        evidenceText: 'Measured font height is 3.2mm on 620 cm² PDP box.',
        evidenceImageSide: 'Back',
        recommendation: 'Issue formal notice under Section 36 of Legal Metrology Act, 2009.',
      },
      {
        id: 'v402',
        title: 'Non-Standard Quantity Unit Symbol',
        category: 'Quantity Related',
        fieldCategory: 'net_quantity',
        statusText: 'Non-standard symbol "gms"',
        requirement: 'Rule 7 mandates standard SI symbol "g" or "kg" without trailing plurals or periods.',
        evidenceText: 'Net quantity printed as "1000 gms" instead of "1 kg".',
        evidenceImageSide: 'Back',
        recommendation: 'Direct manufacturer to modify packaging artwork.',
      },
    ],
  },
];
