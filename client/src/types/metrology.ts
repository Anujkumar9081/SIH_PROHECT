export type ViewPage = 
  | 'login' 
  | 'dashboard' 
  | 'scan' 
  | 'analysis' 
  | 'result' 
  | 'history' 
  | 'violations' 
  | 'reports' 
  | 'analytics';

export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_REVIEW' | 'POTENTIAL_VIOLATION';

export type FieldCategory = 
  | 'manufacturer' 
  | 'net_quantity' 
  | 'mrp' 
  | 'mfg_date' 
  | 'consumer_care' 
  | 'country_origin';

export interface BoundingBox {
  id: string;
  fieldCategory: FieldCategory;
  label: string;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  extractedText: string;
  isDetected: boolean;
  status: 'PASS' | 'FAIL' | 'WARNING';
}

export interface FlaggedViolation {
  id: string;
  title: string;
  category: string; // "Missing Declaration", "MRP Related", "Quantity Related", "Readability", "Other"
  fieldCategory: FieldCategory;
  statusText: string; // e.g. "Not detected", "Font size below 2.5mm", "Missing tax clause"
  requirement: string;
  evidenceText: string;
  evidenceImageSide: 'Front' | 'Back' | 'Side';
  recommendation: string;
}

export interface ProductInspection {
  id: string;
  productName: string;
  brandName: string;
  category: string;
  barcode: string;
  frontImage: string;
  backImage: string;
  sideImage?: string;
  uploadedImages?: string[];
  timestamp: string;
  inspectorName: string;
  district: string;
  confidenceScore: number; // e.g. 91%
  overallStatus: ComplianceStatus;
  declarations: {
    manufacturer: boolean;
    netQuantity: boolean;
    mrp: boolean;
    mfgDate: boolean;
    consumerCare: boolean;
  };
  boundingBoxes: BoundingBox[];
  violations: FlaggedViolation[];
  pdfGeneratedUrl?: string;
  rawData?: any;
}

export interface InspectorUser {
  id: string;
  name: string;
  badgeId: string;
  district: string;
  role: string;
  department: string;
  isLoggedIn: boolean;
}
