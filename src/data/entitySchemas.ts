import { EntityType, QrPurpose, EntityAction } from '../types/entity';
import { 
  Package, 
  Cpu, 
  Wrench, 
  Building2, 
  FileText, 
  ClipboardList, 
  Award, 
  Users, 
  Boxes, 
  Truck, 
  ShieldCheck, 
  Receipt, 
  Workflow, 
  MapPin, 
  Calendar,
  Sparkles,
  Search,
  KeyRound,
  RotateCw,
  Eye,
  AlertTriangle,
  Download,
  BookOpen,
  CheckCircle,
  FileCheck,
  Zap,
  Play,
  QrCode
} from 'lucide-react';

export interface DomainFieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea' | 'url';
  defaultValue: any;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: string[];
}

export interface EntityTypeMeta {
  id: EntityType;
  label: string;
  category: 'Physical Goods' | 'Operations & Assets' | 'Documents & Compliance' | 'People & Organizations' | 'Supply Chain & Events';
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  identityLabel: string;
  secondaryIdLabel?: string;
  defaultPurpose: QrPurpose;
  domainFields: DomainFieldDef[];
  defaultActions: EntityAction[];
}

export const ENTITY_TYPE_DEFINITIONS: Record<EntityType, EntityTypeMeta> = {
  product: {
    id: 'product',
    label: 'Product / Manufactured Item',
    category: 'Physical Goods',
    description: 'Finished consumer or commercial goods with SKU, warranty, specifications, and serial numbers.',
    icon: Package,
    color: '#1D4533',
    bgColor: '#F7EAE0',
    borderColor: '#F9D2BA',
    identityLabel: 'SKU / Model Code',
    secondaryIdLabel: 'Serial Number',
    defaultPurpose: 'authentication',
    domainFields: [
      { key: 'brand', label: 'Brand Name', type: 'text', defaultValue: 'AGB Industrial', placeholder: 'e.g. AGB Industrial', required: true },
      { key: 'manufacturer', label: 'Manufacturer Name', type: 'text', defaultValue: 'AGB Technologies Ltd', placeholder: 'e.g. AGB Technologies Ltd', required: true },
      { key: 'hsn', label: 'HSN / Tariff Code', type: 'text', defaultValue: '9031.80', placeholder: 'e.g. 9031.80' },
      { key: 'gst', label: 'GST Rate (%)', type: 'number', defaultValue: 18 },
      { key: 'warrantyMonths', label: 'Warranty Period (Months)', type: 'number', defaultValue: 24, helpText: 'Active warranty duration from manufacturing date' },
      { key: 'batchNumber', label: 'Batch / Lot Number', type: 'text', defaultValue: `BATCH-${new Date().getFullYear()}-01`, placeholder: 'e.g. BATCH-2026-01' },
      { key: 'mfgDate', label: 'Manufacturing Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { key: 'expDate', label: 'Expiry / EOL Date', type: 'date', defaultValue: '2030-12-31' },
      { key: 'price', label: 'MRP / Price (₹)', type: 'text', defaultValue: '₹12,500', placeholder: 'e.g. ₹12,500' }
    ],
    defaultActions: [
      { id: 'act-view-passport', label: 'View Digital Passport', actionType: 'view_details' },
      { id: 'act-verify-auth', label: 'Verify Authenticity', actionType: 'verify_certificate' },
      { id: 'act-dl-manual', label: 'Download User Manual', actionType: 'download_manual' },
      { id: 'act-reg-warranty', label: 'Register Warranty', actionType: 'register_warranty' }
    ]
  },

  machine: {
    id: 'machine',
    label: 'Industrial Machine / Unit',
    category: 'Operations & Assets',
    description: 'Factory machinery, CNC, hydraulic pumps, compressors, robotics, and production lines.',
    icon: Cpu,
    color: '#0369A1',
    bgColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    identityLabel: 'Machine ID / Asset Tag',
    secondaryIdLabel: 'Serial Number',
    defaultPurpose: 'maintenance',
    domainFields: [
      { key: 'manufacturer', label: 'Manufacturer', type: 'text', defaultValue: 'Siemens Industrial Automation', required: true },
      { key: 'model', label: 'Model Series', type: 'text', defaultValue: 'PRO-V5000', required: true },
      { key: 'powerRating', label: 'Power / Capacity Rating', type: 'text', defaultValue: '45 kW / 380V 3-Phase', placeholder: 'e.g. 45 kW / 380V' },
      { key: 'installationDate', label: 'Installation Date', type: 'date', defaultValue: '2025-01-15' },
      { key: 'lastCalibrationDate', label: 'Last Calibration Date', type: 'date', defaultValue: '2026-06-10' },
      { key: 'maintenanceIntervalDays', label: 'Maintenance Interval (Days)', type: 'number', defaultValue: 90, helpText: 'Routine inspection cycle in days' },
      { key: 'operatingDepartment', label: 'Plant / Department', type: 'text', defaultValue: 'Pune Assembly Bay 3' },
      { key: 'safetyCertStatus', label: 'Safety Certification', type: 'select', defaultValue: 'Active - ISO 45001', options: ['Active - ISO 45001', 'Pending Inspection', 'Recertification Due'] },
      { key: 'sopUrl', label: 'SOP Document URL', type: 'url', defaultValue: 'https://agbtechnologies.com/sop/machine-v5000', placeholder: 'https://...' }
    ],
    defaultActions: [
      { id: 'act-report-breakdown', label: 'Report Machine Breakdown', actionType: 'report_breakdown' },
      { id: 'act-start-maintenance', label: 'Log Maintenance Inspection', actionType: 'start_work_order' },
      { id: 'act-view-sop', label: 'View Operating SOP', actionType: 'download_manual' },
      { id: 'act-view-history', label: 'View Ledger Trail', actionType: 'view_details' }
    ]
  },

  equipment: {
    id: 'equipment',
    label: 'Equipment & Tooling',
    category: 'Operations & Assets',
    description: 'Specialized testing equipment, tools, medical devices, sensors, and portable field assets.',
    icon: Wrench,
    color: '#D97706',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    identityLabel: 'Equipment Code',
    secondaryIdLabel: 'Calibration Tag',
    defaultPurpose: 'maintenance',
    domainFields: [
      { key: 'equipmentCategory', label: 'Category', type: 'text', defaultValue: 'Precision Calibration Tool', required: true },
      { key: 'custodian', label: 'Assigned Custodian / Tech', type: 'text', defaultValue: 'Rajesh Sharma (Senior QA)' },
      { key: 'storageLocation', label: 'Storage Bay / Bin', type: 'text', defaultValue: 'Tool Crib Bin B-42' },
      { key: 'calibrationFrequency', label: 'Calibration Cycle (Months)', type: 'number', defaultValue: 6 },
      { key: 'accuracyTolerance', label: 'Tolerance Rating', type: 'text', defaultValue: '±0.05% Full Scale' },
      { key: 'depreciatedValue', label: 'Asset Value (₹)', type: 'text', defaultValue: '₹45,000' }
    ],
    defaultActions: [
      { id: 'act-checkin-tool', label: 'Tool Check-In / Out', actionType: 'check_in' },
      { id: 'act-log-calibration', label: 'Verify Calibration', actionType: 'verify_certificate' },
      { id: 'act-report-defect', label: 'Report Defect / Damage', actionType: 'report_breakdown' }
    ]
  },

  asset: {
    id: 'asset',
    label: 'Fixed & Enterprise Asset',
    category: 'Operations & Assets',
    description: 'IT hardware, vehicles, office assets, infrastructure nodes, and capital items.',
    icon: Building2,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    identityLabel: 'Asset Tag Number',
    secondaryIdLabel: 'Finance Ledger ID',
    defaultPurpose: 'inventory',
    domainFields: [
      { key: 'assetClass', label: 'Asset Classification', type: 'select', defaultValue: 'IT & Computing', options: ['IT & Computing', 'Fleet & Vehicle', 'Facility & HVAC', 'Furniture & Fixture'] },
      { key: 'department', label: 'Assigned Department', type: 'text', defaultValue: 'Engineering & R&D' },
      { key: 'purchaseDate', label: 'Purchase Date', type: 'date', defaultValue: '2025-08-20' },
      { key: 'purchaseCost', label: 'Acquisition Cost (₹)', type: 'text', defaultValue: '₹85,000' },
      { key: 'depreciationRate', label: 'Annual Depreciation (%)', type: 'number', defaultValue: 15 },
      { key: 'vendorName', label: 'Vendor / Supplier', type: 'text', defaultValue: 'Dell Commercial Enterprise' }
    ],
    defaultActions: [
      { id: 'act-asset-audit', label: 'Perform Asset Audit Scan', actionType: 'check_in' },
      { id: 'act-transfer-asset', label: 'Request Transfer', actionType: 'custom_action' },
      { id: 'act-view-deprec', label: 'View Asset Passport', actionType: 'view_details' }
    ]
  },

  location: {
    id: 'location',
    label: 'Location / Warehouse Facility',
    category: 'Supply Chain & Events',
    description: 'Geographic sites, warehouse bins, loading docks, inspection labs, and client premises.',
    icon: MapPin,
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    identityLabel: 'Location / Bin Code',
    secondaryIdLabel: 'Facility Code',
    defaultPurpose: 'access',
    domainFields: [
      { key: 'facilityName', label: 'Facility / Building', type: 'text', defaultValue: 'AGB Central Logistics Hub - Bay 4', required: true },
      { key: 'facilityType', label: 'Location Type', type: 'select', defaultValue: 'Warehouse Bin', options: ['Warehouse Bin', 'Manufacturing Plant', 'Inspection Lab', 'Distribution Center', 'Office'] },
      { key: 'addressLine', label: 'Physical Address', type: 'text', defaultValue: 'Plot 48, Chakan Industrial Area, Pune' },
      { key: 'city', label: 'City', type: 'text', defaultValue: 'Pune' },
      { key: 'state', label: 'State', type: 'text', defaultValue: 'Maharashtra' },
      { key: 'pincode', label: 'PIN Code', type: 'text', defaultValue: '410501' },
      { key: 'geoCoordinates', label: 'GPS Coordinates (Lat, Lng)', type: 'text', defaultValue: '18.7606, 73.8567' },
      { key: 'storageCapacity', label: 'Storage Capacity / Pallets', type: 'number', defaultValue: 500 }
    ],
    defaultActions: [
      { id: 'act-checkin-loc', label: 'Check-In at Location', actionType: 'check_in' },
      { id: 'act-view-assets-loc', label: 'View Assets in Bin', actionType: 'view_details' },
      { id: 'act-open-maps', label: 'Navigate via GPS', actionType: 'open_url' }
    ]
  },

  document: {
    id: 'document',
    label: 'Digital Document / Compliance SOP',
    category: 'Documents & Compliance',
    description: 'Standard operating procedures, manuals, engineering blueprints, contracts, and safety sheets.',
    icon: FileText,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    identityLabel: 'Document Control #',
    secondaryIdLabel: 'Version Code',
    defaultPurpose: 'documentation',
    domainFields: [
      { key: 'docType', label: 'Document Type', type: 'select', defaultValue: 'Standard Operating Procedure (SOP)', options: ['Standard Operating Procedure (SOP)', 'Engineering Drawing', 'Safety Data Sheet (MSDS)', 'Legal Contract', 'Quality Manual'] },
      { key: 'versionNumber', label: 'Document Version', type: 'text', defaultValue: 'v3.2.0', required: true },
      { key: 'issuedDate', label: 'Release / Effective Date', type: 'date', defaultValue: '2026-01-01' },
      { key: 'expiryDate', label: 'Review / Expiry Date', type: 'date', defaultValue: '2027-01-01' },
      { key: 'author', label: 'Author / Created By', type: 'text', defaultValue: 'QA Compliance Directorate' },
      { key: 'approver', label: 'Approved By', type: 'text', defaultValue: 'Dr. V. K. Mehta (Chief Operations Officer)' },
      { key: 'digitalHash', label: 'SHA-256 Document Hash', type: 'text', defaultValue: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' },
      { key: 'downloadUrl', label: 'Verified Document PDF URL', type: 'url', defaultValue: 'https://agbtechnologies.com/docs/sop-qa-2026.pdf', placeholder: 'https://...' }
    ],
    defaultActions: [
      { id: 'act-verify-doc', label: 'Verify Document Hash', actionType: 'verify_certificate' },
      { id: 'act-download-doc', label: 'Download Verified PDF', actionType: 'download_manual' },
      { id: 'act-view-revisions', label: 'View Version History', actionType: 'view_details' }
    ]
  },

  work_order: {
    id: 'work_order',
    label: 'Work Order & Service Ticket',
    category: 'Operations & Assets',
    description: 'Maintenance requests, installation tasks, defect fixes, inspections, and ERP field jobs.',
    icon: ClipboardList,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    identityLabel: 'Work Order Ticket #',
    secondaryIdLabel: 'ERP Reference #',
    defaultPurpose: 'maintenance',
    domainFields: [
      { key: 'priority', label: 'Job Priority', type: 'select', defaultValue: 'P2 - High Priority', options: ['P1 - Critical Emergency', 'P2 - High Priority', 'P3 - Medium', 'P4 - Routine Scheduled'] },
      { key: 'assignedTechnician', label: 'Assigned Engineer / Tech', type: 'text', defaultValue: 'Vikram Joshi (Field Specialist)', required: true },
      { key: 'targetAsset', label: 'Target Asset / Machine Code', type: 'text', defaultValue: 'MACH-AGB-HYDRO-500' },
      { key: 'scheduledStartDate', label: 'Scheduled Start', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { key: 'estimatedHours', label: 'Estimated Work Hours', type: 'number', defaultValue: 4 },
      { key: 'requiredParts', label: 'Required Spare Parts', type: 'textarea', defaultValue: '1x Pressure Valve Seal, 2x O-Ring 40mm, High-Temp Lubricant' },
      { key: 'checklist', label: 'Pre-Task Safety Checklist', type: 'textarea', defaultValue: '1. Lockout/Tagout confirmed\n2. Pressure depressurized\n3. PPE gloves & goggles worn' }
    ],
    defaultActions: [
      { id: 'act-start-wo', label: 'Start Work Order Execution', actionType: 'start_work_order' },
      { id: 'act-upload-wo-evidence', label: 'Upload Proof / Inspection Photo', actionType: 'custom_action' },
      { id: 'act-complete-wo', label: 'Sign & Mark Completed', actionType: 'custom_action' }
    ]
  },

  certificate: {
    id: 'certificate',
    label: 'Compliance Certificate / Test Report',
    category: 'Documents & Compliance',
    description: 'ISO certificates, CE conformity, calibration reports, authenticity seals, and audit records.',
    icon: Award,
    color: '#0D9488',
    bgColor: '#F0FDFA',
    borderColor: '#CCFBF1',
    identityLabel: 'Certificate Serial #',
    secondaryIdLabel: 'Accreditation Body ID',
    defaultPurpose: 'verification',
    domainFields: [
      { key: 'issuingAuthority', label: 'Certifying Body / Authority', type: 'text', defaultValue: 'TÜV Rheinland India Pvt. Ltd.', required: true },
      { key: 'standardCode', label: 'Accreditation Standard', type: 'text', defaultValue: 'ISO 9001:2015 & CE Directive 2006/42/EC', required: true },
      { key: 'issueDate', label: 'Certificate Issue Date', type: 'date', defaultValue: '2025-05-10' },
      { key: 'validUntil', label: 'Valid Through / Renewal Date', type: 'date', defaultValue: '2028-05-09' },
      { key: 'scopeDescription', label: 'Certified Scope of Operations', type: 'textarea', defaultValue: 'Design, Manufacturing and Testing of High-Pressure Industrial Pumping Systems' },
      { key: 'verificationHash', label: 'Cryptographic Signature', type: 'text', defaultValue: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    ],
    defaultActions: [
      { id: 'act-verify-cert-now', label: 'Verify Cryptographic Authenticity', actionType: 'verify_certificate' },
      { id: 'act-dl-cert', label: 'Download Official PDF Certificate', actionType: 'download_manual' }
    ]
  },

  batch: {
    id: 'batch',
    label: 'Manufacturing Batch / Stock Lot',
    category: 'Supply Chain & Events',
    description: 'Production runs, raw material lots, formulation batches, and quality inspection groups.',
    icon: Boxes,
    color: '#84CC16',
    bgColor: '#F7FEE7',
    borderColor: '#ECFCCB',
    identityLabel: 'Batch / Lot Number',
    secondaryIdLabel: 'QA Release Code',
    defaultPurpose: 'traceability',
    domainFields: [
      { key: 'productFamily', label: 'Product Model / Family', type: 'text', defaultValue: 'HydroMax 500 Component Sub-Assembly', required: true },
      { key: 'batchQuantity', label: 'Total Units in Batch', type: 'number', defaultValue: 250 },
      { key: 'productionShift', label: 'Shift / Line', type: 'text', defaultValue: 'Shift A - Chakan Plant Line 2' },
      { key: 'qcInspector', label: 'QA Release Inspector', type: 'text', defaultValue: 'Ananya Deshmukh (Lead QA)' },
      { key: 'rawMaterialBatch', label: 'Raw Material Supplier Lot', type: 'text', defaultValue: 'STEEL-JINDAL-2026-Q2-88' },
      { key: 'qaPassRate', label: 'First Pass Yield (%)', type: 'number', defaultValue: 99.2 }
    ],
    defaultActions: [
      { id: 'act-view-batch-trail', label: 'Trace Batch Provenance', actionType: 'view_details' },
      { id: 'act-verify-qa-release', label: 'View QA Release Certificate', actionType: 'verify_certificate' }
    ]
  },

  shipment: {
    id: 'shipment',
    label: 'Logistics Shipment / Consignment',
    category: 'Supply Chain & Events',
    description: 'In-transit consignments, courier boxes, freight pallets, and export shipping containers.',
    icon: Truck,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    identityLabel: 'AWB / Tracking Number',
    secondaryIdLabel: 'Consignment Bill #',
    defaultPurpose: 'traceability',
    domainFields: [
      { key: 'carrierName', label: 'Logistics Carrier', type: 'text', defaultValue: 'Blue Dart Express / DHL Global', required: true },
      { key: 'originCity', label: 'Origin Hub', type: 'text', defaultValue: 'Pune Central Logistics Hub' },
      { key: 'destinationCity', label: 'Destination Hub / Client', type: 'text', defaultValue: 'Bengaluru Industrial Tech Park' },
      { key: 'dispatchDate', label: 'Dispatch Timestamp', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { key: 'expectedDelivery', label: 'Estimated Delivery Date', type: 'date', defaultValue: '2026-08-20' },
      { key: 'packageCount', label: 'Total Pallets / Boxes', type: 'number', defaultValue: 12 },
      { key: 'tempControlled', label: 'Temperature Sensitive (°C)', type: 'text', defaultValue: 'Standard Ambient (15°C - 30°C)' }
    ],
    defaultActions: [
      { id: 'act-track-shipment', label: 'Live Carrier GPS Tracking', actionType: 'open_url' },
      { id: 'act-pod-sign', label: 'Scan & Sign Proof of Delivery (POD)', actionType: 'check_in' }
    ]
  },

  customer: {
    id: 'customer',
    label: 'Customer / Enterprise Client',
    category: 'People & Organizations',
    description: 'Corporate accounts, VIP clients, distributors, retail partners, and registered buyers.',
    icon: Users,
    color: '#9333EA',
    bgColor: '#FAF5FF',
    borderColor: '#F3E8FF',
    identityLabel: 'Customer Account ID',
    secondaryIdLabel: 'Tax / GSTIN',
    defaultPurpose: 'customer_experience',
    domainFields: [
      { key: 'companyName', label: 'Client / Company Name', type: 'text', defaultValue: 'Tata Steel Industrial Solutions Ltd', required: true },
      { key: 'contactPerson', label: 'Key Contact Person', type: 'text', defaultValue: 'Sunil Nair (VP Procurement)' },
      { key: 'email', label: 'Official Contact Email', type: 'text', defaultValue: 'procurement.tata@tatasteel.com', required: true },
      { key: 'phone', label: 'Contact Phone', type: 'text', defaultValue: '+91 98200 12345' },
      { key: 'tier', label: 'Account Tier', type: 'select', defaultValue: 'Tier 1 Enterprise Platinum', options: ['Tier 1 Enterprise Platinum', 'Tier 2 Commercial Gold', 'Tier 3 Standard'] },
      { key: 'assignedManager', label: 'UniQR Account Manager', type: 'text', defaultValue: 'Priya Sundaram' }
    ],
    defaultActions: [
      { id: 'act-view-customer-profile', label: 'View Enterprise Portal', actionType: 'view_details' },
      { id: 'act-contact-support', label: 'Contact Dedicated Support', actionType: 'open_url' }
    ]
  },

  employee: {
    id: 'employee',
    label: 'Employee / Field Technician',
    category: 'People & Organizations',
    description: 'Field engineers, factory technicians, QA inspectors, contractors, and operator badges.',
    icon: Users,
    color: '#0891B2',
    bgColor: '#ECFEFF',
    borderColor: '#CFFAFE',
    identityLabel: 'Employee Badge ID',
    secondaryIdLabel: 'Govt ID / Aadhaar Hash',
    defaultPurpose: 'identification',
    domainFields: [
      { key: 'department', label: 'Department / Unit', type: 'text', defaultValue: 'Field Engineering Services', required: true },
      { key: 'designation', label: 'Job Role / Designation', type: 'text', defaultValue: 'Senior Field Service Engineer' },
      { key: 'certificationLevel', label: 'Skill Certification Level', type: 'text', defaultValue: 'Certified Level III Precision Technician' },
      { key: 'emergencyContact', label: 'Emergency Contact Phone', type: 'text', defaultValue: '+91 98765 43210' },
      { key: 'bloodGroup', label: 'Blood Group', type: 'text', defaultValue: 'O+ Positive' }
    ],
    defaultActions: [
      { id: 'act-verify-employee-badge', label: 'Verify Digital Staff Badge', actionType: 'verify_certificate' },
      { id: 'act-call-employee', label: 'Call Technician', actionType: 'open_url' }
    ]
  },

  warranty: {
    id: 'warranty',
    label: 'Warranty & Service Care Plan',
    category: 'Documents & Compliance',
    description: 'Extended warranties, AMC contracts, service level agreements, and claim cards.',
    icon: ShieldCheck,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    identityLabel: 'Warranty Policy Number',
    secondaryIdLabel: 'Invoice Link ID',
    defaultPurpose: 'verification',
    domainFields: [
      { key: 'coverageType', label: 'Coverage Type', type: 'select', defaultValue: 'Comprehensive All-Risk + On-Site AMC', options: ['Comprehensive All-Risk + On-Site AMC', 'Standard Manufacturer Warranty', 'Limited Parts Only'] },
      { key: 'coveredProductName', label: 'Covered Entity Name', type: 'text', defaultValue: 'AGB HydroMax 500 Industrial Pump' },
      { key: 'startDate', label: 'Policy Start Date', type: 'date', defaultValue: '2025-06-01' },
      { key: 'endDate', label: 'Policy Expiration Date', type: 'date', defaultValue: '2028-05-31' },
      { key: 'maxClaimLimit', label: 'Max Claim Liability (₹)', type: 'text', defaultValue: '₹2,50,000' },
      { key: 'tollFreeClaim', label: '24x7 Claim Hotline', type: 'text', defaultValue: '1800-425-UNIQR' }
    ],
    defaultActions: [
      { id: 'act-check-warranty-status', label: 'Check Real-Time Warranty Validity', actionType: 'verify_certificate' },
      { id: 'act-file-claim', label: 'File Instant Service Claim', actionType: 'custom_action' }
    ]
  },

  invoice: {
    id: 'invoice',
    label: 'Tax Invoice & Commercial Bill',
    category: 'Documents & Compliance',
    description: 'GST tax invoices, commercial bills of supply, payment receipts, and proforma orders.',
    icon: Receipt,
    color: '#475569',
    bgColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    identityLabel: 'Invoice Number',
    secondaryIdLabel: 'IRN / E-Invoice Hash',
    defaultPurpose: 'payment',
    domainFields: [
      { key: 'billingEntity', label: 'Billed To Customer', type: 'text', defaultValue: 'Tata Steel Industrial Solutions Ltd', required: true },
      { key: 'invoiceDate', label: 'Invoice Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { key: 'dueDate', label: 'Payment Due Date', type: 'date', defaultValue: '2026-09-15' },
      { key: 'totalAmount', label: 'Grand Total Amount (₹)', type: 'text', defaultValue: '₹1,47,500' },
      { key: 'gstin', label: 'Buyer GSTIN', type: 'text', defaultValue: '27AABCT2345Z1Z8' },
      { key: 'paymentStatus', label: 'Payment Status', type: 'select', defaultValue: 'Paid - Razorpay / UPI', options: ['Paid - Razorpay / UPI', 'Pending Net-30', 'Overdue'] }
    ],
    defaultActions: [
      { id: 'act-view-invoice-pdf', label: 'Download GST Invoice PDF', actionType: 'download_manual' },
      { id: 'act-pay-invoice-now', label: 'Pay via UPI / Card Gateway', actionType: 'custom_action' }
    ]
  },

  process: {
    id: 'process',
    label: 'Business Process & Workflow',
    category: 'Operations & Assets',
    description: 'Manufacturing workflows, QA multi-gate pipelines, audit sequences, and logistics stages.',
    icon: Workflow,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#E0F2FE',
    identityLabel: 'Workflow Code',
    secondaryIdLabel: 'Process Version',
    defaultPurpose: 'traceability',
    domainFields: [
      { key: 'processOwner', label: 'Process Owner', type: 'text', defaultValue: 'Manufacturing Operations Lead' },
      { key: 'totalStages', label: 'Number of Stages / Steps', type: 'number', defaultValue: 6 },
      { key: 'cycleTimeMinutes', label: 'Standard Cycle Time (Mins)', type: 'number', defaultValue: 45 },
      { key: 'targetProduct', label: 'Target Product Line', type: 'text', defaultValue: 'HydroMax Pump Series' }
    ],
    defaultActions: [
      { id: 'act-view-process-status', label: 'View Pipeline Progress', actionType: 'view_details' },
      { id: 'act-advance-step', label: 'Advance to Next Workflow Gate', actionType: 'custom_action' }
    ]
  },

  process_step: {
    id: 'process_step',
    label: 'Process Step / Quality Gate',
    category: 'Operations & Assets',
    description: 'Individual inspection stations, assembly steps, testing gates, and operator sign-offs.',
    icon: CheckCircle,
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    identityLabel: 'Step Identifier',
    secondaryIdLabel: 'Parent Process Code',
    defaultPurpose: 'traceability',
    domainFields: [
      { key: 'stepSequence', label: 'Sequence #', type: 'number', defaultValue: 3 },
      { key: 'stationName', label: 'Workstation / Test Bench', type: 'text', defaultValue: 'Hydrostatic Pressure Test Rig #2' },
      { key: 'passCriteria', label: 'Mandatory Pass Criteria', type: 'text', defaultValue: 'Hold 750 PSI for 180 seconds with 0 bar pressure loss' },
      { key: 'assignedOperator', label: 'Certified Operator', type: 'text', defaultValue: 'Manoj Pillai (QC Lead)' }
    ],
    defaultActions: [
      { id: 'act-log-step-result', label: 'Log Test Pass / Fail', actionType: 'custom_action' },
      { id: 'act-view-spec', label: 'View Test Bench Spec', actionType: 'download_manual' }
    ]
  },

  service: {
    id: 'service',
    label: 'Service Offering / AMC',
    category: 'Operations & Assets',
    description: 'Annual maintenance contracts, calibration services, on-site diagnostics, and overhaul packages.',
    icon: Zap,
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    identityLabel: 'Service SKU Code',
    secondaryIdLabel: 'Service Category',
    defaultPurpose: 'customer_experience',
    domainFields: [
      { key: 'serviceCategory', label: 'Service Category', type: 'text', defaultValue: 'Predictive Vibration & Thermography Diagnostics' },
      { key: 'servicePrice', label: 'Service Price (₹)', type: 'text', defaultValue: '₹18,000 / Visit' },
      { key: 'slaResponseHours', label: 'Guaranteed SLA Response (Hrs)', type: 'number', defaultValue: 4 },
      { key: 'deliverables', label: 'Service Deliverables', type: 'textarea', defaultValue: 'Full thermal imaging report, vibration FFT analysis, bearing health score, lubricant check' }
    ],
    defaultActions: [
      { id: 'act-book-service', label: 'Book On-Site Service Visit', actionType: 'custom_action' },
      { id: 'act-view-service-sla', label: 'View Service SLA Terms', actionType: 'view_details' }
    ]
  },

  event: {
    id: 'event',
    label: 'Event, Expo & Conference Pass',
    category: 'Supply Chain & Events',
    description: 'Exhibition passes, factory tour badges, conference tickets, and VIP venue access.',
    icon: Calendar,
    color: '#E11D48',
    bgColor: '#FFF1F2',
    borderColor: '#FFE4E6',
    identityLabel: 'Pass / Ticket Code',
    secondaryIdLabel: 'Attendee Code',
    defaultPurpose: 'access',
    domainFields: [
      { key: 'eventName', label: 'Event / Expo Name', type: 'text', defaultValue: 'India Industrial Expo 2026 - Mumbai', required: true },
      { key: 'venue', label: 'Venue / Hall', type: 'text', defaultValue: 'Bombay Exhibition Centre, Hall 3 - Booth C12' },
      { key: 'accessTier', label: 'Access Tier', type: 'select', defaultValue: 'VIP All-Access Delegate', options: ['VIP All-Access Delegate', 'Exhibitor Staff', 'Standard Visitor'] },
      { key: 'validDates', label: 'Validity Date(s)', type: 'text', defaultValue: '18-21 August 2026' }
    ],
    defaultActions: [
      { id: 'act-scan-event-gate', label: 'Gate Access Check-In', actionType: 'check_in' },
      { id: 'act-view-schedule', label: 'View Conference Schedule', actionType: 'open_url' }
    ]
  },

  custom: {
    id: 'custom',
    label: 'Custom / Dynamic Entity',
    category: 'Physical Goods',
    description: 'Fully tailored entity schema with custom dynamic fields and tailored QR interactions.',
    icon: Sparkles,
    color: '#1D4533',
    bgColor: '#F7EAE0',
    borderColor: '#F9D2BA',
    identityLabel: 'Custom Entity ID',
    secondaryIdLabel: 'Secondary Code',
    defaultPurpose: 'custom',
    domainFields: [
      { key: 'customCategory', label: 'Category Name', type: 'text', defaultValue: 'General Identity' },
      { key: 'department', label: 'Owner / Department', type: 'text', defaultValue: 'Operations' }
    ],
    defaultActions: [
      { id: 'act-view-custom-passport', label: 'View Digital Identity', actionType: 'view_details' }
    ]
  }
};

export const QR_PURPOSE_DEFINITIONS: Record<QrPurpose, {
  id: QrPurpose;
  label: string;
  description: string;
  icon: any;
  color: string;
}> = {
  identification: {
    id: 'identification',
    label: 'Identity & Access Verification',
    description: 'Instant entity identification, staff credential checks, and location check-in.',
    icon: QrCode,
    color: '#0891B2'
  },
  authentication: {
    id: 'authentication',
    label: 'Anti-Counterfeit & Provenance',
    description: 'Cryptographic SHA-256 tamper-evident verification proving legitimate origin.',
    icon: ShieldCheck,
    color: '#1D4533'
  },
  traceability: {
    id: 'traceability',
    label: 'Supply Chain & Batch Traceability',
    description: 'End-to-end custody tracking across suppliers, warehouses, logistics, and buyers.',
    icon: Truck,
    color: '#2563EB'
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance & Work Orders',
    description: 'Scan machine to log inspection, trigger breakdown ticket, or view repair history.',
    icon: Wrench,
    color: '#D97706'
  },
  documentation: {
    id: 'documentation',
    label: 'Digital Manuals & SOPs',
    description: 'Instant access to latest versioned operating manuals, safety sheets, and blueprints.',
    icon: BookOpen,
    color: '#7C3AED'
  },
  inventory: {
    id: 'inventory',
    label: 'Asset & Warehouse Inventory',
    description: 'Physical audit scans, bin lookups, tool checkout/checkin, and stock audits.',
    icon: Boxes,
    color: '#4F46E5'
  },
  payment: {
    id: 'payment',
    label: 'Invoicing & Commercial Settlement',
    description: 'Scan to view GST invoice, settle commercial payment via UPI/Razorpay.',
    icon: Receipt,
    color: '#475569'
  },
  access: {
    id: 'access',
    label: 'Access Control & Gate Entry',
    description: 'Secure time-bound gate check-in, exhibition passes, and secure facility access.',
    icon: KeyRound,
    color: '#E11D48'
  },
  verification: {
    id: 'verification',
    label: 'Certificate & Audit Verification',
    description: 'Instant validation of ISO standards, calibration dates, and safety accreditation.',
    icon: Award,
    color: '#0D9488'
  },
  customer_experience: {
    id: 'customer_experience',
    label: 'Customer Loyalty & Product Passport',
    description: 'Interactive brand passport, warranty registration, customer care hotline.',
    icon: Sparkles,
    color: '#9333EA'
  },
  analytics: {
    id: 'analytics',
    label: 'Scan Telemetry & Geo-Analytics',
    description: 'High-frequency telemetry recording location, device, frequency, and risk score.',
    icon: Zap,
    color: '#0284C7'
  },
  custom: {
    id: 'custom',
    label: 'Custom Multi-Purpose Gateway',
    description: 'Tailored action rules, custom webhooks, and flexible enterprise routing.',
    icon: Workflow,
    color: '#1D4533'
  }
};

export function getEntitySchema(type: EntityType): EntityTypeMeta {
  return ENTITY_TYPE_DEFINITIONS[type] || ENTITY_TYPE_DEFINITIONS.product;
}

export function getDefaultDomainData(type: EntityType): Record<string, any> {
  const schema = getEntitySchema(type);
  const data: Record<string, any> = {};
  schema.domainFields.forEach(f => {
    data[f.key] = f.defaultValue;
  });
  return data;
}

export function getDefaultActions(type: EntityType): EntityAction[] {
  const schema = getEntitySchema(type);
  return [...schema.defaultActions];
}
