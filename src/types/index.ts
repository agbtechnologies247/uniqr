export * from './passport';
export * from './entity';

export type QrStyleType = 
  | 'square' 
  | 'rounded-square' 
  | 'rounded-modules' 
  | 'circular-dots' 
  | 'soft-rounded' 
  | 'minimal' 
  | 'high-contrast';

export interface QrStylingConfig {
  style: QrStyleType;
  fgColor: string;
  bgColor: string;
  gradient: boolean;
  gradientColor: string;
  transparentBg: boolean;
  cornerDotStyle: 'square' | 'rounded' | 'dots';
  cornerStyle?: string;
  dotStyle?: string;
  logoUrl?: string;
  borderPadding: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export type FieldType = 
  | 'Text'
  | 'Long Text'
  | 'Number'
  | 'Currency'
  | 'Percentage'
  | 'Date'
  | 'Date & Time'
  | 'Boolean'
  | 'Dropdown'
  | 'Multi Select'
  | 'Radio Buttons'
  | 'Checkbox Group'
  | 'Email'
  | 'Phone'
  | 'URL'
  | 'Barcode'
  | 'QR Reference'
  | 'File Upload'
  | 'Image Upload'
  | 'Signature'
  | 'GPS Location'
  | 'JSON'
  | 'Rich Text'
  | 'Formula'
  | 'Lookup'
  | 'Relation'
  | 'Rating'
  | 'AI Generated'
  | 'Hidden/Internal';

export interface FieldValidationRule {
  required?: boolean;
  readOnly?: boolean;
  isPublic?: boolean;
  defaultValue?: string;
  min?: number;
  max?: number;
  currency?: string;
  decimalPlaces?: number;
  regex?: string;
  regexDescription?: string;
  placeholder?: string;
  helpText?: string;
  options?: string[]; // for Dropdown, Multi Select, Radio Buttons
}

export interface CustomFieldDef {
  id: string;
  name: string;
  type: FieldType;
  value: string | number | boolean | string[];
  validation?: FieldValidationRule;
}

export interface BuilderSection {
  id: string;
  title: string;
  category: 'Details' | 'Trail' | 'Custom';
  isSystemProtected?: boolean;
  isCollapsed?: boolean;
  fields: CustomFieldDef[];
}

export interface TamperEvidentTrailEvent {
  id: string;
  qrId: string;
  type: string; // e.g. Manufactured, QC Passed, Packed, Dispatched, Sold, Serviced, Disposed
  title?: string;
  action?: string;
  module: 'Manufacturing' | 'BOM' | 'Quality' | 'Packaging' | 'Inventory' | 'Warehouse' | 'Logistics' | 'Dealer' | 'Customer' | 'Warranty' | 'Rental' | 'Service' | 'Recall' | 'Disposal';
  timestamp: string;
  location?: string;
  department?: string;
  user?: string;
  erpTask?: string;
  digitalSignature?: string;
  previousHash: string;
  currentHash: string;
  details?: Record<string, any>;
}

export interface LocationObject {
  country?: string;
  state?: string;
  city?: string;
  addressLine1?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export interface UniversalPayment {
  paymentId: string;
  paymentNumber: string;
  paymentReference: string;
  paymentType: 'SALE' | 'RENTAL' | 'SERVICE' | 'INVOICE' | 'REFUND';
  paymentMethod: 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'RAZORPAY';
  maskedIdentifier: string;
  amount: number;
  currency: string;
  taxAmount?: number;
  status: 'INITIATED' | 'PENDING' | 'AUTHORIZED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  gateway?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  completedAt?: string;
}

export interface Product {
  id: string;
  uniqrCode: string; // e.g. UQ-8AF92B7A2
  name: string;
  sku: string;
  brand: string;
  manufacturer: string;
  description: string;
  category?: string;
  hsn: string;
  gst: number;
  batchNumber: string;
  serialNumber: string;
  mfgDate: string;
  expDate: string;
  warrantyMonths: number;
  customFields: Record<string, string>;
  builderSections?: BuilderSection[];
  trailEvents?: TamperEvidentTrailEvent[];
  locationObject?: LocationObject;
  paymentDetails?: UniversalPayment;
  imageUrl?: string;
  pdfDocument?: {
    name: string;
    size: number;
    dataUrl: string;
    uploadedAt: string;
  };
  galleryImages?: {
    id: string;
    name: string;
    size: number;
    dataUrl: string;
    uploadedAt: string;
  }[];
  websiteUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  longDescription?: string;
  tags: string[];
  location: string;
  supplier: string;
  status: 'Active' | 'Archived' | 'Draft' | 'Recall' | 'Rented' | 'Under Inspection' | 'Repair';
  verificationStatus?: string;
  warrantyStatus?: string;
  createdAt: string;
  updatedAt: string;
  connectedApps: string[]; // e.g. ['Enterprise ERP', 'Asset Tracking', 'CRM']
  passportConfig?: import('./passport').PassportConfig; // per-entity passport customization override
  entityType?: import('./entity').EntityType;
  entityCode?: string;
  identityNumber?: string;
  secondaryIdentifier?: string;
  organization?: string;
  domainData?: Record<string, any>;
  qrPurpose?: import('./entity').QrPurpose;
  qrConfig?: QrStylingConfig;
  relationships?: import('./entity').EntityRelationship[];
  scanBehavior?: import('./entity').ScanBehaviorConfig;
}

export interface QrCodeRecord {
  id: string;
  uniqrCode: string;
  productId: string;
  productName?: string;
  styleConfig?: QrStylingConfig;
  config?: any;
  publicUrl?: string;
  generatedAt?: string;
  createdAt?: string;
  totalScans: number;
  totalDownloads: number;
  lastScannedAt?: string;
  status: 'Active' | 'Revoked';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 
    | 'Company' 
    | 'Product' 
    | 'QR' 
    | 'Customer' 
    | 'Invoice' 
    | 'Warranty' 
    | 'Warehouse' 
    | 'Supplier' 
    | 'App'
    | 'RentalItem'
    | 'ServiceTicket'
    | 'Batch'
    | 'Employee'
    | 'Bin';
  details?: Record<string, string>;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  relation: 
    | 'OWNS' 
    | 'CREATED' 
    | 'HAS_QR' 
    | 'CONNECTED_TO' 
    | 'MANUFACTURED_BY' 
    | 'PURCHASED_BY' 
    | 'PURCHASED_IN'
    | 'PURCHASED'
    | 'RENTED'
    | 'HAS_WARRANTY'
    | 'CREATED_SERVICE_REQUEST'
    | 'BELONGS_TO'
    | 'STORED_IN'
    | 'SUPPLIED_BY'
    | 'PART_OF_BATCH'
    | 'COVERED_BY'
    | 'INCLUDED_IN'
    | 'HAS_SERIAL'
    | 'CONTAINS'
    | 'TRANSFERRED_TO'
    | 'HAS_BIN'
    | 'SOLD_TO'
    | 'GENERATED_WARRANTY'
    | 'SERVICED_AT'
    | 'USED_IN'
    | 'SUPPLIES';
}

export interface ScanEvent {
  id: string;
  uniqrCode: string;
  productName: string;
  timestamp: string;
  country: string;
  city: string;
  device: string;
  os: string;
  browser: string;
  referral: string;
  appSource: string;
  isRepeat: boolean;
  status?: string;
  ip?: string;
  latency?: string;
}

export interface SubscriptionTier {
  id: 'free' | 'starter' | 'pro' | 'business' | 'factory' | 'enterprise';
  name: string;
  priceINR: number;
  basePriceINR?: number;
  gstPercent?: number; // 18%
  gstAmountINR?: number;
  totalAmountINR?: number;
  qrLimitDaily: number; // 0 = unlimited lifetime cap for free
  lifetimeCap?: number;
  description?: string;
  features: string[];
  isPopular?: boolean;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keySecret: string;
  createdAt: string;
  lastUsedAt?: string;
  status: 'Active' | 'Revoked';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  target?: string;
  ip: string;
  details: string;
}

// BillSoft Universal QR Identity System (UQIS) Types
export type BillSoftEntityType = 
  | 'Product' 
  | 'Customer' 
  | 'Invoice' 
  | 'Rental Asset' 
  | 'Warehouse' 
  | 'Stock Batch' 
  | 'Warranty' 
  | 'Service Ticket' 
  | 'Purchase' 
  | 'Supplier' 
  | 'Employee';

export interface BillSoftQrIdentity {
  id: string;
  uuid: string;
  entityType: BillSoftEntityType;
  entityId: string;
  publicQrId: string; // e.g. BS-PROD-00001254
  encryptedToken: string;
  status: 'Active' | 'Revoked' | 'Archived';
  createdAt: string;
  lastScan?: string;
  scanCount: number;
  neo4jNodeId: string;
  publicUrl: string;
  customMetadata?: Record<string, any>;
}

export interface BillSoftEntityItem {
  id: string;
  type: BillSoftEntityType;
  publicQrId: string;
  name: string;
  codeOrSku: string;
  categoryOrRole?: string;
  status: string;
  createdAt: string;
  details: Record<string, string>;
  neo4jRelations: Array<{ relation: string; targetId: string; targetName: string; targetType: string }>;
}

export interface LabelTemplateConfig {
  id: string;
  name: string;
  dimensions: string; // e.g., '40x20 mm', '50x30 mm', '80x50 mm', 'A4 Grid', 'A5'
  widthMm: number;
  heightMm: number;
  showLogo: boolean;
  showBarcode: boolean;
  showDetails: boolean;
  qrSizePx: number;
}

