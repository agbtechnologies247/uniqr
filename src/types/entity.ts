import { BuilderSection, TamperEvidentTrailEvent, QrStylingConfig, LocationObject, UniversalPayment } from './index';
import { PassportConfig } from './passport';

export type EntityType = 
  | 'product'
  | 'machine'
  | 'equipment'
  | 'asset'
  | 'location'
  | 'document'
  | 'work_order'
  | 'process'
  | 'process_step'
  | 'batch'
  | 'shipment'
  | 'customer'
  | 'employee'
  | 'certificate'
  | 'warranty'
  | 'invoice'
  | 'service'
  | 'event'
  | 'custom';

export type QrPurpose = 
  | 'identification'
  | 'authentication'
  | 'traceability'
  | 'maintenance'
  | 'documentation'
  | 'inventory'
  | 'payment'
  | 'access'
  | 'verification'
  | 'customer_experience'
  | 'analytics'
  | 'custom';

export type EntityStatus = 
  | 'Active' 
  | 'Under Inspection' 
  | 'Repair' 
  | 'Archived' 
  | 'Draft' 
  | 'Recall' 
  | 'Rented' 
  | 'Completed' 
  | 'Pending';

export type RelationType = 
  | 'OWNS' 
  | 'LOCATED_AT' 
  | 'MANUFACTURED_BY' 
  | 'SERVICED_BY' 
  | 'PART_OF_BATCH' 
  | 'CERTIFIED_BY' 
  | 'REQUIRES_WORK_ORDER' 
  | 'ASSIGNED_TO' 
  | 'CONTAINS' 
  | 'ASSOCIATED_WITH'
  | 'PURCHASED_BY'
  | 'SUPPLIED_BY';

export interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  targetEntityName?: string;
  targetEntityType?: EntityType;
  relationType: RelationType;
  metadata?: Record<string, any>;
}

export interface EntityAction {
  id: string;
  label: string;
  actionType: 
    | 'view_details' 
    | 'report_breakdown' 
    | 'start_work_order' 
    | 'verify_certificate' 
    | 'download_manual' 
    | 'register_warranty' 
    | 'check_in' 
    | 'open_url'
    | 'custom_action';
  urlOrPayload?: string;
  icon?: string;
}

export interface ScanBehaviorConfig {
  isDynamic: boolean;
  requireAuth: boolean;
  enableLocationTracking: boolean;
  enableScanAnalytics: boolean;
  customRedirectUrl?: string;
  actions: EntityAction[];
}

/**
 * UniversalEntity — Core domain model for UniQR
 * 
 * Implements 4-tier data architecture:
 * Level 1: Universal Core (Name, Entity Type, Code, Description, Status, Org, Tags)
 * Level 2: Identity (SKU, Serial #, Machine ID, Doc #, Work Order #, Customer ID, etc.)
 * Level 3: Domain Data (Entity-specific schema fields + custom fields + builder sections)
 * Level 4: QR Behavior & Purpose (Purpose, Scan behavior, Action triggers, Passport config)
 */
export interface UniversalEntity {
  // ─── Level 1: Universal Core ──────────────────────────────────────────────
  id: string;
  uniqrCode: string;
  entityType: EntityType;
  entityCode: string;
  name: string;
  description: string;
  status: EntityStatus;
  organization: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;

  // ─── Level 2: Identity ───────────────────────────────────────────────────
  identityNumber: string; // SKU, Serial #, Machine #, Doc #, Asset Code
  secondaryIdentifier?: string; // Batch #, Asset Code, Customer Code, Model

  // ─── Level 3: Domain Data ────────────────────────────────────────────────
  domainData: Record<string, any>;
  customFields: Record<string, string>;
  builderSections?: BuilderSection[];
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

  // ─── Level 4: QR Behavior, Purpose & Actions ──────────────────────────────
  qrPurpose: QrPurpose;
  qrConfig?: QrStylingConfig;
  passportConfig?: PassportConfig;
  scanBehavior?: ScanBehaviorConfig;

  // ─── Graph Relationships & Trail ─────────────────────────────────────────
  relationships: EntityRelationship[];
  trailEvents?: TamperEvidentTrailEvent[];
  connectedApps: string[];

  // ─── Backward-Compatibility Accessors (Product fields) ───────────────────
  sku?: string;
  brand?: string;
  manufacturer?: string;
  category?: string;
  hsn?: string;
  gst?: number;
  batchNumber?: string;
  serialNumber?: string;
  mfgDate?: string;
  expDate?: string;
  warrantyMonths?: number;
  warrantyStatus?: string;
  verificationStatus?: string;
  location?: string;
  supplier?: string;
}
