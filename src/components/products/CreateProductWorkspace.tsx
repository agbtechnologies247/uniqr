import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Save, Sparkles, Download, Share2, Copy, Check, QrCode, 
  Layers, Plus, ShieldCheck, History, RefreshCw, Zap, CheckCircle2, Lock,
  Truck, Cpu, Dumbbell, Smartphone, Thermometer, FileSpreadsheet, X, ChevronRight, ChevronLeft, Trash2, ChevronDown, Eye, Sliders, Settings,
  Building, HardHat, Sprout, Gem, Key, ShoppingBag, Pill, Wrench, FileText, ClipboardList, Award, Users, Boxes, MapPin, Receipt, Workflow, BookOpen, AlertTriangle, Link as LinkIcon, Edit3, Wand2, Network
} from 'lucide-react';
import { Product, BuilderSection, EntityType, QrPurpose, EntityRelationship } from '../../types';
import { SectionFieldBuilder } from './SectionFieldBuilder';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';
import { 
  ENTITY_TYPE_DEFINITIONS, 
  QR_PURPOSE_DEFINITIONS, 
  getEntitySchema, 
  getDefaultDomainData,
  EntityTypeMeta
} from '../../data/entitySchemas';

interface CreateProductWorkspaceProps {
  productToEdit?: Product | null;
  onSave: (entity: Product) => void;
  onCancel: () => void;
}

// Dynamic, fully editable Core Identity Field definition (Nothing is fixed)
export interface CoreIdentityField {
  id: string;
  key: string;
  label: string;
  value: string;
  placeholder?: string;
  column: 1 | 2;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
}

export interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  entityType: EntityType;
  qrPurpose: QrPurpose;
  coreFields: CoreIdentityField[];
  builderSections: BuilderSection[];
  tags: string[];
  description?: string;
  createdAt: string;
}

export const DEFAULT_CUSTOM_TEMPLATES: CustomTemplate[] = [
  {
    id: 'tpl-mach-inspect',
    name: 'Industrial Machine & CNC Unit Inspection',
    category: 'Industrial Machinery',
    entityType: 'machine',
    qrPurpose: 'maintenance',
    coreFields: [
      { id: 'f-1', key: 'name', label: 'Machine Model / Tag', value: '5-Axis Precision Milling Center', column: 1, type: 'text' },
      { id: 'f-2', key: 'identityNumber', label: 'Machine ID / Asset Code', value: 'MACH-CNC-V500', column: 1, type: 'text' },
      { id: 'f-3', key: 'secondaryIdentifier', label: 'Spindle Serial Number', value: 'SN-SPINDLE-9021', column: 1, type: 'text' },
      { id: 'f-4', key: 'organization', label: 'OEM Manufacturer', value: 'Siemens Industrial Automation', column: 2, type: 'text' },
      { id: 'f-5', key: 'location', label: 'Plant Bay / Cell', value: 'Chakan Assembly Bay 3', column: 2, type: 'text' },
      { id: 'f-6', key: 'status', label: 'Machine Health', value: 'Active / Calibrated', column: 2, type: 'select', options: ['Active / Calibrated', 'Under Repair', 'Decommissioned'] }
    ],
    builderSections: [
      {
        id: 'sec-mfg-specs',
        title: 'CNC & Spindle Specifications',
        category: 'Details',
        fields: [
          { id: 'f-pwr', name: 'Power Rating', type: 'Dropdown', value: '45 kW 3-Phase', validation: { isPublic: true } },
          { id: 'f-rpm', name: 'Max Spindle RPM', type: 'Number', value: 18000, validation: { isPublic: true } },
          { id: 'f-cal', name: 'Calibration Due Interval', type: 'Dropdown', value: '90 Days', validation: { isPublic: true } }
        ]
      }
    ],
    tags: ['Machine', 'CNC', 'Siemens', 'CriticalAsset'],
    createdAt: '2026-08-01'
  },
  {
    id: 'tpl-doc-iso',
    name: 'ISO 9001 / CE Compliance Controlled Document',
    category: 'Digital SOP',
    entityType: 'document',
    qrPurpose: 'documentation',
    coreFields: [
      { id: 'f-1', key: 'name', label: 'Document Title', value: 'ISO 9001:2015 Quality & Safety SOP', column: 1, type: 'text' },
      { id: 'f-2', key: 'identityNumber', label: 'Document Control ID', value: 'DOC-SOP-QA-2026', column: 1, type: 'text' },
      { id: 'f-3', key: 'secondaryIdentifier', label: 'Revision Version', value: 'v3.2.0-APPROVED', column: 1, type: 'text' },
      { id: 'f-4', key: 'organization', label: 'Issuing Directorate', value: 'AGB Compliance Directorate', column: 2, type: 'text' },
      { id: 'f-5', key: 'location', label: 'Digital Vault URI', value: 'https://agbtechnologies.com/docs/sop.pdf', column: 2, type: 'text' },
      { id: 'f-6', key: 'status', label: 'Approval Status', value: 'Active / Approved', column: 2, type: 'select', options: ['Active / Approved', 'Under Review', 'Archived'] }
    ],
    builderSections: [
      {
        id: 'sec-doc-gov',
        title: 'Document Governance & Cryptographic Hash',
        category: 'Details',
        fields: [
          { id: 'f-auth', name: 'Document Approver', type: 'Text', value: 'Dr. V. K. Mehta (COO)', validation: { isPublic: true } },
          { id: 'f-sha', name: 'SHA-256 Checksum', type: 'Text', value: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', validation: { isPublic: true } }
        ]
      }
    ],
    tags: ['Document', 'SOP', 'ISO9001', 'Compliance'],
    createdAt: '2026-08-01'
  }
];

// Context-Aware Schema Configuration to eliminate user manual effort
interface EntityContextMapping {
  primaryIdLabel: string;
  primaryIdPlaceholder: string;
  primaryIdExample: string;
  secondaryIdLabel: string;
  secondaryIdPlaceholder: string;
  secondaryIdExample: string;
  authorityLabel: string;
  authorityPlaceholder: string;
  defaultAuthority: string;
  locationLabel: string;
  locationPlaceholder: string;
  defaultLocation: string;
  statusOptions: string[];
  defaultName: string;
  defaultDescription: string;
  suggestedPurpose: QrPurpose;
  purposeRationale: string;
  defaultTags: string[];
  suggestedRelationVerb: EntityRelationship['relationType'];
  defaultBuilderSections: BuilderSection[];
}

const ENTITY_CONTEXT_MAP: Partial<Record<EntityType, EntityContextMapping>> & { product: EntityContextMapping } = {
  product: {
    primaryIdLabel: 'SKU / Model Code',
    primaryIdPlaceholder: 'e.g. SKU-HM500-IND',
    primaryIdExample: `SKU-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
    secondaryIdLabel: 'Serial / Unit Number',
    secondaryIdPlaceholder: 'e.g. SN-2026-00127',
    secondaryIdExample: `SN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    authorityLabel: 'Brand & Manufacturer',
    authorityPlaceholder: 'e.g. AGB Industrial Equipment Ltd.',
    defaultAuthority: 'AGB Industrial Equipment Ltd.',
    locationLabel: 'Warehouse / Retail Node',
    locationPlaceholder: 'e.g. Pune Central Warehouse Bay 3',
    defaultLocation: 'Pune Central Warehouse Bay 3',
    statusOptions: ['Active / In Stock', 'Sold / Dispatched', 'Under Inspection', 'Recall', 'Draft'],
    defaultName: 'Precision Hydraulic Water Pump XR-500',
    defaultDescription: 'Flagship 5 HP stainless steel industrial water pump with tamper-evident digital identity passport.',
    suggestedPurpose: 'authentication',
    purposeRationale: 'Optimized for consumer authenticity verification, warranty registration, and anti-counterfeit checks.',
    defaultTags: ['Product', 'Industrial', 'WaterPump', 'UniQR'],
    suggestedRelationVerb: 'MANUFACTURED_BY',
    defaultBuilderSections: [
      {
        id: 'sec-specs',
        title: 'Technical & Engineering Specifications',
        category: 'Details',
        fields: [
          { id: 'f-power', name: 'Power Rating', type: 'Dropdown', value: '5 HP (3.7 kW)', validation: { isPublic: true } },
          { id: 'f-voltage', name: 'Operating Voltage', type: 'Text', value: '415V 3-Phase', validation: { isPublic: true } },
          { id: 'f-pressure', name: 'Max Operating Pressure', type: 'Text', value: '10 Bar (145 PSI)', validation: { isPublic: true } }
        ]
      },
      {
        id: 'sec-warranty',
        title: 'Commercial & Warranty Coverage',
        category: 'Details',
        fields: [
          { id: 'f-warranty', name: 'Warranty Period', type: 'Text', value: '24 Months Comprehensive', validation: { isPublic: true } },
          { id: 'f-hsn', name: 'HSN Tariff Code', type: 'Text', value: '8413.70', validation: { isPublic: true } }
        ]
      }
    ]
  },
  machine: {
    primaryIdLabel: 'Machine ID / Asset Tag',
    primaryIdPlaceholder: 'e.g. MCH-CNC-5000',
    primaryIdExample: `MCH-CNC-${Math.floor(1000 + Math.random() * 9000)}`,
    secondaryIdLabel: 'OEM Serial Number',
    secondaryIdPlaceholder: 'e.g. SN-SIEMENS-8841',
    secondaryIdExample: `SN-SIEMENS-${Math.floor(10000 + Math.random() * 90000)}`,
    authorityLabel: 'Equipment Manufacturer / OEM',
    authorityPlaceholder: 'e.g. Siemens Industrial Automation',
    defaultAuthority: 'Siemens Industrial Automation',
    locationLabel: 'Plant Hub / Floor Bay',
    locationPlaceholder: 'e.g. Pune Assembly Plant Bay 4',
    defaultLocation: 'Pune Assembly Plant Bay 4',
    statusOptions: ['Operational / Online', 'Under Maintenance', 'Calibration Due', 'Decommissioned'],
    defaultName: '5-Axis Industrial CNC Machining Center V500',
    defaultDescription: 'High-precision automated CNC milling system for aerospace and automotive tooling.',
    suggestedPurpose: 'maintenance',
    purposeRationale: 'Configured for machine telemetry, breakdown reporting, calibration checks, and maintenance work orders.',
    defaultTags: ['Machine', 'CNC', 'Operations', 'Siemens'],
    suggestedRelationVerb: 'LOCATED_AT',
    defaultBuilderSections: [
      {
        id: 'sec-mach-ops',
        title: 'Operational & Calibration Specs',
        category: 'Details',
        fields: [
          { id: 'f-power', name: 'Spindle Power', type: 'Text', value: '45 kW / 18,000 RPM', validation: { isPublic: true } },
          { id: 'f-calib', name: 'Last Calibration Date', type: 'Date', value: '2026-06-10', validation: { isPublic: true } },
          { id: 'f-interval', name: 'Maintenance Interval', type: 'Text', value: '90 Days Cycle', validation: { isPublic: true } }
        ]
      }
    ]
  },
  equipment: {
    primaryIdLabel: 'Equipment Tag #',
    primaryIdPlaceholder: 'e.g. EQP-CAL-402',
    primaryIdExample: `EQP-TOOL-${Math.floor(100 + Math.random() * 900)}`,
    secondaryIdLabel: 'Calibration Certificate Ref',
    secondaryIdPlaceholder: 'e.g. CAL-2026-904',
    secondaryIdExample: `CAL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    authorityLabel: 'Custodian / Tooling Lead',
    authorityPlaceholder: 'e.g. Quality Assurance Directorate',
    defaultAuthority: 'Quality Assurance Directorate',
    locationLabel: 'Storage Crib / Tool Bin',
    locationPlaceholder: 'e.g. Tool Crib Bin B-42',
    defaultLocation: 'Tool Crib Bin B-42',
    statusOptions: ['Available / In Crib', 'Checked Out / In Use', 'Calibration Overdue', 'Damaged / Quarantined'],
    defaultName: 'Digital Torque Calibrator & Micrometer Kit',
    defaultDescription: 'NIST-traceable precision torque wrench calibrator with digital readout for QA auditing.',
    suggestedPurpose: 'maintenance',
    purposeRationale: 'Optimized for tool checkout tracking, periodic calibration validation, and inspection auditing.',
    defaultTags: ['Equipment', 'Tooling', 'Calibration', 'QA'],
    suggestedRelationVerb: 'LOCATED_AT',
    defaultBuilderSections: [
      {
        id: 'sec-eqp-details',
        title: 'Tooling & Accuracy Ratings',
        category: 'Details',
        fields: [
          { id: 'f-range', name: 'Torque Range', type: 'Text', value: '5 - 250 Nm', validation: { isPublic: true } },
          { id: 'f-tol', name: 'Accuracy Tolerance', type: 'Text', value: '±0.05% Full Scale', validation: { isPublic: true } }
        ]
      }
    ]
  },
  asset: {
    primaryIdLabel: 'Enterprise Asset Tag',
    primaryIdPlaceholder: 'e.g. AST-IT-2026-881',
    primaryIdExample: `AST-IT-${Math.floor(1000 + Math.random() * 9000)}`,
    secondaryIdLabel: 'Finance Ledger Reference',
    secondaryIdPlaceholder: 'e.g. CAPEX-GL-40192',
    secondaryIdExample: `CAPEX-GL-${Math.floor(10000 + Math.random() * 90000)}`,
    authorityLabel: 'Asset Owner / Department',
    authorityPlaceholder: 'e.g. Engineering & R&D',
    defaultAuthority: 'Engineering & R&D',
    locationLabel: 'Deployment Office / Room',
    locationPlaceholder: 'e.g. Pune Tech Center Floor 3',
    defaultLocation: 'Pune Tech Center Floor 3',
    statusOptions: ['In Service / Assigned', 'In Inventory / Spare', 'Under Repair', 'Decommissioned'],
    defaultName: 'Enterprise AI Compute Server Node A100',
    defaultDescription: 'High-density GPU rack server dedicated to real-time telemetry processing and neural network indexing.',
    suggestedPurpose: 'inventory',
    purposeRationale: 'Streamlines enterprise asset audits, physical verification, depreciation tracking, and custody handovers.',
    defaultTags: ['Asset', 'IT', 'Infrastructure', 'Capex'],
    suggestedRelationVerb: 'LOCATED_AT',
    defaultBuilderSections: [
      {
        id: 'sec-asset-fin',
        title: 'Financial & Capitalization Profile',
        category: 'Details',
        fields: [
          { id: 'f-cost', name: 'Acquisition Cost', type: 'Text', value: '₹4,85,000', validation: { isPublic: true } },
          { id: 'f-deprec', name: 'Annual Depreciation', type: 'Text', value: '15% Straight Line', validation: { isPublic: true } }
        ]
      }
    ]
  },
  location: {
    primaryIdLabel: 'Facility / Bin Code',
    primaryIdPlaceholder: 'e.g. LOC-PUN-WH-B4',
    primaryIdExample: `LOC-PUN-WH-${Math.floor(10 + Math.random() * 90)}`,
    secondaryIdLabel: 'GPS Coordinates Tag',
    secondaryIdPlaceholder: 'e.g. 18.7606° N, 73.8567° E',
    secondaryIdExample: '18.7606° N, 73.8567° E',
    authorityLabel: 'Site Operator / Facility Manager',
    authorityPlaceholder: 'e.g. AGB Logistics Hub Pune',
    defaultAuthority: 'AGB Logistics Hub Pune',
    locationLabel: 'Physical Address & MIDC Zone',
    locationPlaceholder: 'e.g. Plot 48, Chakan Industrial Area Phase 2, Pune',
    defaultLocation: 'Plot 48, Chakan Industrial Area Phase 2, Pune',
    statusOptions: ['Active / Operational', 'Full Capacity', 'Restricted Access', 'Maintenance'],
    defaultName: 'Central Logistics Warehouse — Storage Bay 4',
    defaultDescription: 'Temperature-monitored high-bay warehouse zone for finished industrial goods and spares.',
    suggestedPurpose: 'access',
    purposeRationale: 'Facilitates physical check-ins, automated navigation, storage allocation, and spatial asset routing.',
    defaultTags: ['Location', 'Facility', 'Warehouse', 'Chakan'],
    suggestedRelationVerb: 'CONTAINS',
    defaultBuilderSections: [
      {
        id: 'sec-loc-cap',
        title: 'Storage & Environmental Parameters',
        category: 'Details',
        fields: [
          { id: 'f-pallets', name: 'Total Pallet Capacity', type: 'Number', value: 850, validation: { isPublic: true } },
          { id: 'f-temp', name: 'Temperature Zone', type: 'Text', value: 'Ambient (20°C - 25°C)', validation: { isPublic: true } }
        ]
      }
    ]
  },
  document: {
    primaryIdLabel: 'Document Control #',
    primaryIdPlaceholder: 'e.g. DOC-SOP-QA-2026',
    primaryIdExample: `DOC-SOP-2026-${Math.floor(100 + Math.random() * 900)}`,
    secondaryIdLabel: 'Version / Revision Code',
    secondaryIdPlaceholder: 'e.g. v3.2.1-RELEASE',
    secondaryIdExample: 'v3.2.1-RELEASE',
    authorityLabel: 'Author / Approving Authority',
    authorityPlaceholder: 'e.g. Dr. V. K. Mehta (Chief Operations Officer)',
    defaultAuthority: 'Dr. V. K. Mehta (Chief Operations Officer)',
    locationLabel: 'Digital Vault / Repository URI',
    locationPlaceholder: 'e.g. s3://uniqr-vault/compliance/sop-2026.pdf',
    defaultLocation: 's3://uniqr-vault/compliance/sop-2026.pdf',
    statusOptions: ['Published & Active', 'Draft / In Review', 'Superseded', 'Archived'],
    defaultName: 'Standard Operating Procedure (SOP) — HydroMax Calibration',
    defaultDescription: 'Controlled engineering document detailing pressure test procedures, safety protocols, and tolerances.',
    suggestedPurpose: 'documentation',
    purposeRationale: 'Guarantees controlled document distribution, verified PDF access, version integrity, and cryptographic proof.',
    defaultTags: ['Document', 'SOP', 'Quality', 'Compliance'],
    suggestedRelationVerb: 'CERTIFIED_BY',
    defaultBuilderSections: [
      {
        id: 'sec-doc-gov',
        title: 'Document Governance & Effective Dates',
        category: 'Details',
        fields: [
          { id: 'f-eff-date', name: 'Effective Release Date', type: 'Date', value: '2026-01-01', validation: { isPublic: true } },
          { id: 'f-rev-cycle', name: 'Review Frequency', type: 'Text', value: 'Annual (Next: Jan 2027)', validation: { isPublic: true } }
        ]
      }
    ]
  },
  certificate: {
    primaryIdLabel: 'Certificate Serial #',
    primaryIdPlaceholder: 'e.g. CERT-ISO-9001-2026',
    primaryIdExample: `CERT-TUV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    secondaryIdLabel: 'Accreditation Standard',
    secondaryIdPlaceholder: 'e.g. ISO 9001:2015 & CE Directive',
    secondaryIdExample: 'ISO 9001:2015 & CE Directive',
    authorityLabel: 'Certifying Body / Lab',
    authorityPlaceholder: 'e.g. TÜV Rheinland India Pvt. Ltd.',
    defaultAuthority: 'TÜV Rheinland India Pvt. Ltd.',
    locationLabel: 'Accredited Testing Facility',
    locationPlaceholder: 'e.g. TÜV Testing Center Mumbai',
    defaultLocation: 'TÜV Testing Center Mumbai',
    statusOptions: ['Valid & Active', 'Expiring Soon', 'Under Audit', 'Revoked'],
    defaultName: 'ISO 9001:2015 Quality Management Certificate',
    defaultDescription: 'International accredited certification verifying manufacturing conformity for pressure vessels and pumps.',
    suggestedPurpose: 'verification',
    purposeRationale: 'Delivers instant cryptographic authenticity validation, expiry tracking, and auditor verification.',
    defaultTags: ['Certificate', 'ISO', 'TÜV', 'Compliance'],
    suggestedRelationVerb: 'CERTIFIED_BY',
    defaultBuilderSections: [
      {
        id: 'sec-cert-valid',
        title: 'Accreditation Scope & Validity',
        category: 'Details',
        fields: [
          { id: 'f-valid-until', name: 'Valid Through Date', type: 'Date', value: '2028-05-09', validation: { isPublic: true } },
          { id: 'f-seal-hash', name: 'Digital Cryptographic Hash', type: 'Text', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4', validation: { isPublic: true } }
        ]
      }
    ]
  },
  work_order: {
    primaryIdLabel: 'Work Order Ticket #',
    primaryIdPlaceholder: 'e.g. WO-2026-08149',
    primaryIdExample: `WO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    secondaryIdLabel: 'ERP Reference Number',
    secondaryIdPlaceholder: 'e.g. ERP-JOB-44910',
    secondaryIdExample: `ERP-JOB-${Math.floor(1000 + Math.random() * 9000)}`,
    authorityLabel: 'Assigned Engineer / Tech',
    authorityPlaceholder: 'e.g. Vikram Joshi (Senior Field Engineer)',
    defaultAuthority: 'Vikram Joshi (Senior Field Engineer)',
    locationLabel: 'Target Job Site / Machine Bay',
    locationPlaceholder: 'e.g. Pune Plant Bay 4 (HydroMax Unit 1)',
    defaultLocation: 'Pune Plant Bay 4 (HydroMax Unit 1)',
    statusOptions: ['Open / Scheduled', 'In Progress', 'Pending Spare Parts', 'Resolved / Completed'],
    defaultName: 'Annual Preventative Maintenance & Seal Overhaul',
    defaultDescription: 'Scheduled 12-month inspection, pressure relief test, gasket replacement, and vibration analysis.',
    suggestedPurpose: 'maintenance',
    purposeRationale: 'Enables field engineers to execute tasks, upload photo evidence, sign off checklists, and log repair times.',
    defaultTags: ['WorkOrder', 'Maintenance', 'Service', 'FieldJob'],
    suggestedRelationVerb: 'SERVICED_BY',
    defaultBuilderSections: [
      {
        id: 'sec-wo-task',
        title: 'Job Requirements & Safety Protocols',
        category: 'Details',
        fields: [
          { id: 'f-priority', name: 'Job Priority Level', type: 'Dropdown', value: 'P2 - High Priority', validation: { isPublic: true } },
          { id: 'f-est-hours', name: 'Estimated Hours', type: 'Number', value: 4.5, validation: { isPublic: true } },
          { id: 'f-spares', name: 'Required Parts', type: 'Text', value: '1x Pressure Valve Seal, 2x O-Ring 40mm', validation: { isPublic: true } }
        ]
      }
    ]
  },
  customer: {
    primaryIdLabel: 'Customer ID / GSTIN',
    primaryIdPlaceholder: 'e.g. CUST-ABC-MFG-27AABCA',
    primaryIdExample: `CUST-IND-${Math.floor(1000 + Math.random() * 9000)}`,
    secondaryIdLabel: 'ERP Account Number',
    secondaryIdPlaceholder: 'e.g. ACC-2026-9041',
    secondaryIdExample: `ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    authorityLabel: 'Key Account Manager',
    authorityPlaceholder: 'e.g. Amit Sharma (VP Enterprise Accounts)',
    defaultAuthority: 'Amit Sharma (VP Enterprise Accounts)',
    locationLabel: 'Primary Billing / Delivery Address',
    locationPlaceholder: 'e.g. ABC Industrial Park, Ahmedabad, Gujarat',
    defaultLocation: 'ABC Industrial Park, Ahmedabad, Gujarat',
    statusOptions: ['Active Enterprise', 'Contract In Review', 'Onboarding', 'Dormant'],
    defaultName: 'ABC Manufacturing Enterprises Pvt. Ltd.',
    defaultDescription: 'Tier-1 automotive component manufacturer and enterprise client of UniQR ecosystem.',
    suggestedPurpose: 'identification',
    purposeRationale: 'Powers client digital portals, service contract access, equipment fleets, and authorized reorders.',
    defaultTags: ['Customer', 'Enterprise', 'Automotive', 'Client'],
    suggestedRelationVerb: 'OWNS',
    defaultBuilderSections: [
      {
        id: 'sec-cust-sla',
        title: 'Service Level Agreement (SLA) & Terms',
        category: 'Details',
        fields: [
          { id: 'f-sla-tier', name: 'SLA Support Level', type: 'Dropdown', value: 'Platinum 24/7 Dedicated', validation: { isPublic: true } },
          { id: 'f-contract-val', name: 'Annual Contract Value', type: 'Text', value: '₹24,50,000 / Year', validation: { isPublic: true } }
        ]
      }
    ]
  },
  batch: {
    primaryIdLabel: 'Batch / Lot Number',
    primaryIdPlaceholder: 'e.g. BATCH-2026-08-HM500',
    primaryIdExample: `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    secondaryIdLabel: 'QA Release Code',
    secondaryIdPlaceholder: 'e.g. QC-REL-9921',
    secondaryIdExample: `QC-REL-${Math.floor(1000 + Math.random() * 9000)}`,
    authorityLabel: 'Production Line / Plant Operator',
    authorityPlaceholder: 'e.g. Chakan Plant Assembly Line 2',
    defaultAuthority: 'Chakan Plant Assembly Line 2',
    locationLabel: 'Holding Quarantine / Storage Bay',
    locationPlaceholder: 'e.g. QC Holding Warehouse Bay A',
    defaultLocation: 'QC Holding Warehouse Bay A',
    statusOptions: ['QA Passed & Released', 'Quarantine / Testing', 'In Production', 'Depleted'],
    defaultName: 'Manufacturing Lot — HydroMax 500 (1,000 Units)',
    defaultDescription: 'Production run of 1,000 precision water pump units with metallurgical certification.',
    suggestedPurpose: 'traceability',
    purposeRationale: 'Unlocks granular batch traceability, raw material genealogy, recall targeting, and production tracking.',
    defaultTags: ['Batch', 'Production', 'Lot', 'Chakan'],
    suggestedRelationVerb: 'CONTAINS',
    defaultBuilderSections: [
      {
        id: 'sec-batch-qa',
        title: 'Production Run & QA Validation',
        category: 'Details',
        fields: [
          { id: 'f-lot-size', name: 'Total Batch Quantity', type: 'Number', value: 1000, validation: { isPublic: true } },
          { id: 'f-qa-lead', name: 'Inspecting QA Engineer', type: 'Text', value: 'Rajesh Sharma (Lead QA)', validation: { isPublic: true } }
        ]
      }
    ]
  },
  shipment: {
    primaryIdLabel: 'Airway Bill / Tracking #',
    primaryIdPlaceholder: 'e.g. AWB-EXP-881920',
    primaryIdExample: `AWB-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    secondaryIdLabel: 'Carrier Dispatch Reference',
    secondaryIdPlaceholder: 'e.g. CARRIER-APEX-901',
    secondaryIdExample: `CARRIER-APEX-${Math.floor(100 + Math.random() * 900)}`,
    authorityLabel: 'Logistics Carrier / Dispatcher',
    authorityPlaceholder: 'e.g. Apex Global Freight Lines',
    defaultAuthority: 'Apex Global Freight Lines',
    locationLabel: 'Current Transit Depot / Hub',
    locationPlaceholder: 'e.g. Bhiwandi Central Logistics Hub',
    defaultLocation: 'Bhiwandi Central Logistics Hub',
    statusOptions: ['In Transit', 'Out for Delivery', 'Delivered', 'Delayed / Exception'],
    defaultName: 'Consignment — 250x HydroMax Pumps to Ahmedabad Plant',
    defaultDescription: 'Express road freight consignment containing 250 units dispatched under insured transit.',
    suggestedPurpose: 'traceability',
    purposeRationale: 'Provides real-time milestone checkpoints, custody handover scanning, carrier tracking, and proof-of-delivery.',
    defaultTags: ['Shipment', 'Logistics', 'Freight', 'Transit'],
    suggestedRelationVerb: 'LOCATED_AT',
    defaultBuilderSections: [
      {
        id: 'sec-shp-details',
        title: 'Freight Manifest & Milestones',
        category: 'Details',
        fields: [
          { id: 'f-carrier', name: 'Freight Service', type: 'Text', value: 'Apex Express Road Logistics', validation: { isPublic: true } },
          { id: 'f-eta', name: 'Estimated Delivery Date', type: 'Date', value: '2026-08-20', validation: { isPublic: true } }
        ]
      }
    ]
  },
  process: {
    primaryIdLabel: 'Process Route Code',
    primaryIdPlaceholder: 'e.g. PROC-HYDRAULIC-ASSY-01',
    primaryIdExample: `PROC-ENG-${Math.floor(100 + Math.random() * 900)}`,
    secondaryIdLabel: 'Engineering Standard Ref',
    secondaryIdPlaceholder: 'e.g. STD-ENG-4402',
    secondaryIdExample: `STD-ENG-${Math.floor(1000 + Math.random() * 9000)}`,
    authorityLabel: 'Process Engineering Lead',
    authorityPlaceholder: 'e.g. Manufacturing Excellence Group',
    defaultAuthority: 'Manufacturing Excellence Group',
    locationLabel: 'Assembly Line / Work Cell',
    locationPlaceholder: 'e.g. Plant 1 Assembly Line 4',
    defaultLocation: 'Plant 1 Assembly Line 4',
    statusOptions: ['Active Process', 'Optimization Phase', 'Under Review', 'Deprecated'],
    defaultName: 'Standard Automated Assembly & Hydrostatic Test Route',
    defaultDescription: 'Automated 6-step manufacturing workflow protocol defining cycle times, safety gates, and torque validation.',
    suggestedPurpose: 'maintenance',
    purposeRationale: 'Guides floor operators through standard work steps, verifies quality interlocks, and logs cycle yields.',
    defaultTags: ['Process', 'Assembly', 'Engineering', 'Standard'],
    suggestedRelationVerb: 'ASSOCIATED_WITH',
    defaultBuilderSections: [
      {
        id: 'sec-proc-steps',
        title: 'Cycle Time & Quality Interlocks',
        category: 'Details',
        fields: [
          { id: 'f-takt', name: 'Target Cycle Time', type: 'Text', value: '4 Minutes 30 Seconds', validation: { isPublic: true } },
          { id: 'f-yield', name: 'Target First-Pass Yield', type: 'Text', value: '99.4%', validation: { isPublic: true } }
        ]
      }
    ]
  }
};

// Generate initial dynamic core identity fields based on mapping
function buildInitialCoreFields(mapping: EntityContextMapping, productToEdit?: Product | null): CoreIdentityField[] {
  return [
    {
      id: 'f-core-name',
      key: 'name',
      label: 'Entity Title / Nomenclature',
      value: productToEdit?.name || mapping.defaultName,
      placeholder: mapping.defaultName,
      column: 1,
      type: 'text'
    },
    {
      id: 'f-core-primary-id',
      key: 'identityNumber',
      label: mapping.primaryIdLabel,
      value: productToEdit?.identityNumber || productToEdit?.sku || mapping.primaryIdExample,
      placeholder: mapping.primaryIdPlaceholder,
      column: 1,
      type: 'text'
    },
    {
      id: 'f-core-sec-id',
      key: 'secondaryIdentifier',
      label: mapping.secondaryIdLabel,
      value: productToEdit?.secondaryIdentifier || productToEdit?.serialNumber || productToEdit?.batchNumber || mapping.secondaryIdExample,
      placeholder: mapping.secondaryIdPlaceholder,
      column: 1,
      type: 'text'
    },
    {
      id: 'f-core-authority',
      key: 'organization',
      label: mapping.authorityLabel,
      value: productToEdit?.organization || productToEdit?.manufacturer || mapping.defaultAuthority,
      placeholder: mapping.authorityPlaceholder,
      column: 2,
      type: 'text'
    },
    {
      id: 'f-core-location',
      key: 'location',
      label: mapping.locationLabel,
      value: productToEdit?.location || mapping.defaultLocation,
      placeholder: mapping.locationPlaceholder,
      column: 2,
      type: 'text'
    },
    {
      id: 'f-core-status',
      key: 'status',
      label: 'Lifecycle / Operational Status',
      value: productToEdit?.status || mapping.statusOptions[0].split(' / ')[0],
      column: 2,
      type: 'select',
      options: mapping.statusOptions
    }
  ];
}

// Generate a collision-free, guaranteed unique QR token
export function generateUniqueToken(existingProducts?: Product[]): string {
  const currentList = existingProducts || storage.getProducts();
  let token = '';
  let attempts = 0;
  do {
    const chars = '0123456789ABCDEF';
    let rand = '';
    for (let i = 0; i < 8; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    token = `UQ-${rand}`;
    attempts++;
  } while (currentList.some(p => p.uniqrCode?.toUpperCase() === token) && attempts < 100);
  return token;
}

export const CreateProductWorkspace: React.FC<CreateProductWorkspaceProps> = ({
  productToEdit,
  onSave,
  onCancel
}) => {
  // 4-Step Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Determine initial entity type and QR purpose
  const initialType: EntityType = productToEdit?.entityType || 'product';
  const initialPurpose: QrPurpose = productToEdit?.qrPurpose || getEntitySchema(initialType).defaultPurpose;
  const initialMapping = ENTITY_CONTEXT_MAP[initialType] || ENTITY_CONTEXT_MAP.product;

  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>(initialType);
  const [selectedPurpose, setSelectedPurpose] = useState<QrPurpose>(initialPurpose);
  const [typeCategoryFilter, setTypeCategoryFilter] = useState<string>('All');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Active Context Mapping based on currently selected Entity Type
  const currentMapping = useMemo(() => {
    return ENTITY_CONTEXT_MAP[selectedEntityType] || ENTITY_CONTEXT_MAP.product;
  }, [selectedEntityType]);

  // FULLY DYNAMIC CORE IDENTITY FIELDS STATE (Nothing is fixed, every field is editable & deletable)
  const [coreFields, setCoreFields] = useState<CoreIdentityField[]>(() => {
    return buildInitialCoreFields(initialMapping, productToEdit);
  });

  // Additional Meta & Form State
  const [formData, setFormData] = useState<{
    uniqrCode: string;
    description: string;
    tags: string[];
    tagInput: string;
    domainData: Record<string, any>;
    customFields: Record<string, string>;
    builderSections: BuilderSection[];
    relationships: EntityRelationship[];
  }>(() => {
    const defaultDomain = getDefaultDomainData(initialType);
    return {
      uniqrCode: productToEdit?.uniqrCode || generateUniqueToken(),
      description: productToEdit?.description || initialMapping.defaultDescription,
      tags: productToEdit?.tags || initialMapping.defaultTags,
      tagInput: '',
      domainData: productToEdit?.domainData || {
        ...defaultDomain,
        ...(productToEdit?.brand ? { brand: productToEdit.brand } : {}),
        ...(productToEdit?.manufacturer ? { manufacturer: productToEdit.manufacturer } : {}),
        ...(productToEdit?.hsn ? { hsn: productToEdit.hsn } : {}),
        ...(productToEdit?.gst ? { gst: productToEdit.gst } : {}),
        ...(productToEdit?.warrantyMonths ? { warrantyMonths: productToEdit.warrantyMonths } : {}),
        ...(productToEdit?.mfgDate ? { mfgDate: productToEdit.mfgDate } : {}),
        ...(productToEdit?.expDate ? { expDate: productToEdit.expDate } : {}),
      },
      customFields: productToEdit?.customFields || {},
      builderSections: productToEdit?.builderSections || initialMapping.defaultBuilderSections,
      relationships: productToEdit?.relationships || []
    };
  });

  // Synchronize form when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      const editType = productToEdit.entityType || 'product';
      setSelectedEntityType(editType);
      setSelectedPurpose(productToEdit.qrPurpose || 'authentication');
      const mapping = ENTITY_CONTEXT_MAP[editType] || ENTITY_CONTEXT_MAP.product;
      setCoreFields(buildInitialCoreFields(mapping, productToEdit));
      setFormData({
        uniqrCode: productToEdit.uniqrCode || generateUniqueToken(storage.getProducts()),
        description: productToEdit.description || mapping.defaultDescription,
        tags: productToEdit.tags || mapping.defaultTags,
        tagInput: '',
        domainData: productToEdit.domainData || {},
        customFields: productToEdit.customFields || {},
        builderSections: productToEdit.builderSections || mapping.defaultBuilderSections,
        relationships: productToEdit.relationships || []
      });
    } else {
      const freshType: EntityType = 'product';
      setSelectedEntityType(freshType);
      const mapping = ENTITY_CONTEXT_MAP[freshType];
      setSelectedPurpose(mapping.suggestedPurpose);
      setCoreFields(buildInitialCoreFields(mapping, null));
      const freshCode = generateUniqueToken(storage.getProducts());
      setFormData({
        uniqrCode: freshCode,
        description: mapping.defaultDescription,
        tags: mapping.defaultTags,
        tagInput: '',
        domainData: getDefaultDomainData(freshType),
        customFields: {},
        builderSections: mapping.defaultBuilderSections,
        relationships: []
      });
    }
  }, [productToEdit]);

  // ─── MEDIA & CONTACT EXTENDED SUPPORT (PDF <= 10MB, Images <= 5MB max 2, URL, Phone, Email, Long Text) ───
  const [pdfDocument, setPdfDocument] = useState<{
    name: string;
    size: number;
    dataUrl: string;
    uploadedAt: string;
  } | null>(productToEdit?.pdfDocument || null);

  const [galleryImages, setGalleryImages] = useState<{
    id: string;
    name: string;
    size: number;
    dataUrl: string;
    uploadedAt: string;
  }[]>(productToEdit?.galleryImages || (productToEdit?.imageUrl ? [{
    id: 'img-legacy',
    name: 'Primary Image',
    size: 1024 * 350,
    dataUrl: productToEdit.imageUrl,
    uploadedAt: new Date().toISOString()
  }] : []));

  // Customizable dynamic contact channels & online resources
  const [contactChannels, setContactChannels] = useState<{
    id: string;
    label: string;
    value: string;
    type: 'url' | 'email' | 'phone' | 'text';
    placeholder?: string;
  }[]>(() => [
    { id: 'c-web', label: 'Website / Portal URL', value: productToEdit?.websiteUrl || '', type: 'url', placeholder: 'https://company.com/entity' },
    { id: 'c-email', label: 'Support & Care Email', value: productToEdit?.contactEmail || '', type: 'email', placeholder: 'support@company.com' },
    { id: 'c-phone', label: 'Helpdesk / Direct Line', value: productToEdit?.contactPhone || '', type: 'phone', placeholder: '+91 98765 43210' }
  ]);
  const [descriptionLabel, setDescriptionLabel] = useState<string>('Description Summary');
  const [longDescription, setLongDescription] = useState<string>(productToEdit?.longDescription || productToEdit?.description || '');

  // Mobile focused step (1 to 7)
  const [mobileStep, setMobileStep] = useState<number>(1);

  // Available system entities for relationship linking
  const [existingEntities, setExistingEntities] = useState<Product[]>([]);
  const [newRelTargetId, setNewRelTargetId] = useState<string>('');
  const [newRelType, setNewRelType] = useState<EntityRelationship['relationType']>(initialMapping.suggestedRelationVerb);

  // Validation handlers
  const isValidEmail = (email: string) => !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPhone = (phone: string) => !phone.trim() || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone.trim().replace(/\s+/g, ''));
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.includes('.');
    } catch {
      return false;
    }
  };

  const handleAddContactChannel = () => {
    sound.playClick();
    const newChan = {
      id: `c-${Date.now()}`,
      label: 'Custom Channel / Link',
      value: '',
      type: 'text' as const,
      placeholder: 'Enter contact details or URL...'
    };
    setContactChannels(prev => [...prev, newChan]);
  };

  const handleRemoveContactChannel = (id: string) => {
    sound.playClick();
    setContactChannels(prev => prev.filter(c => c.id !== id));
  };

  const handleContactLabelChange = (id: string, newLabel: string) => {
    setContactChannels(prev => prev.map(c => c.id === id ? { ...c, label: newLabel } : c));
  };

  const handleContactValueChange = (id: string, val: string) => {
    setContactChannels(prev => prev.map(c => {
      if (c.id !== id) return c;
      let inferredType = c.type;
      if (c.type === 'text') {
        if (val.startsWith('http://') || val.startsWith('https://')) inferredType = 'url';
        else if (val.includes('@') && val.includes('.')) inferredType = 'email';
        else if (/^[+0-9\s-]{7,}$/.test(val)) inferredType = 'phone';
      }
      return { ...c, value: val, type: inferredType };
    }));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Invalid format. Please select a PDF file only.');
      return;
    }
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      alert(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a file under 10MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPdfDocument({
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString()
      });
      sound.playSuccessChime();
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (galleryImages.length + files.length > 2) {
      alert('Maximum 2 images allowed per entity passport.');
      return;
    }
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" is not an image file.`);
        return;
      }
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        alert(`"${file.name}" exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryImages(prev => [
          ...prev.slice(0, 1),
          {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            dataUrl: reader.result as string,
            uploadedAt: new Date().toISOString()
          }
        ]);
        sound.playSuccessChime();
      };
      reader.readAsDataURL(file);
    }
  };

  // USER CUSTOM TEMPLATES STATE (Elevated to top of Entity Creation)
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(() => {
    const saved = localStorage.getItem('uniqr_custom_templates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...DEFAULT_CUSTOM_TEMPLATES.filter(d => !parsed.some((p: any) => p.id === d.id))];
      } catch {
        return DEFAULT_CUSTOM_TEMPLATES;
      }
    }
    return DEFAULT_CUSTOM_TEMPLATES;
  });

  const handleSaveCurrentAsTemplate = () => {
    sound.playClick();
    const nameField = coreFields.find(f => f.key === 'name')?.value || 'Custom Template';
    const tplName = window.prompt('Enter a name for your custom schema template:', `${nameField} Template`);
    if (!tplName || !tplName.trim()) return;

    const newTpl: CustomTemplate = {
      id: `tpl-${Date.now()}`,
      name: tplName.trim(),
      category: selectedEntityType.toUpperCase(),
      entityType: selectedEntityType,
      qrPurpose: selectedPurpose,
      coreFields: JSON.parse(JSON.stringify(coreFields)),
      builderSections: JSON.parse(JSON.stringify(formData.builderSections)),
      tags: [...formData.tags],
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newTpl, ...customTemplates];
    setCustomTemplates(updated);
    localStorage.setItem('uniqr_custom_templates', JSON.stringify(updated));
    sound.playSuccessChime();
    alert(`Template "${tplName}" saved! It is now pinned at the top of your Entity Creation workspace.`);
  };

  const handleApplyTemplate = (tpl: CustomTemplate) => {
    sound.playSuccessChime();
    setSelectedEntityType(tpl.entityType);
    setSelectedPurpose(tpl.qrPurpose);
    setCoreFields(JSON.parse(JSON.stringify(tpl.coreFields)));
    setFormData(prev => ({
      ...prev,
      description: tpl.description || prev.description,
      tags: tpl.tags || prev.tags,
      builderSections: JSON.parse(JSON.stringify(tpl.builderSections))
    }));
  };

  const handleDeleteTemplate = (tplId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (window.confirm('Delete this saved custom template?')) {
      const updated = customTemplates.filter(t => t.id !== tplId);
      setCustomTemplates(updated);
      localStorage.setItem('uniqr_custom_templates', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    setExistingEntities(storage.getProducts().filter(p => p.id !== productToEdit?.id));
  }, [productToEdit]);

  // SMART AUTO-MAPPING: When Entity Type changes, auto-adapt all fields & reduce user friction
  const handleEntityTypeChange = (type: EntityType) => {
    sound.playClick();
    setSelectedEntityType(type);
    const mapping = ENTITY_CONTEXT_MAP[type] || ENTITY_CONTEXT_MAP.product;
    
    // Auto-select recommended QR purpose
    setSelectedPurpose(mapping.suggestedPurpose);
    setNewRelType(mapping.suggestedRelationVerb);

    // Auto-populate dynamic core fields and specifications
    setCoreFields(buildInitialCoreFields(mapping));
    setFormData(prev => ({
      ...prev,
      description: mapping.defaultDescription,
      tags: mapping.defaultTags,
      builderSections: mapping.defaultBuilderSections,
      domainData: getDefaultDomainData(type)
    }));
  };

  // Quick 1-Click "Load AI Recommended Preset" button
  const handleLoadSmartPreset = () => {
    sound.playSuccessChime();
    const mapping = currentMapping;
    setCoreFields(buildInitialCoreFields(mapping));
    setFormData(prev => ({
      ...prev,
      description: mapping.defaultDescription,
      tags: mapping.defaultTags,
      builderSections: mapping.defaultBuilderSections,
      domainData: getDefaultDomainData(selectedEntityType)
    }));
  };

  // One-tap Mobile Quick Preset: Custom Digital Entity + Identity & Access Verification -> Step 2
  const handleMobileAutoFillCustom = () => {
    sound.playSuccessChime();
    const customType: EntityType = 'custom';
    setSelectedEntityType(customType);
    setSelectedPurpose('access');
    const mapping = ENTITY_CONTEXT_MAP.custom || ENTITY_CONTEXT_MAP.product;
    setCoreFields(buildInitialCoreFields(mapping));
    setFormData(prev => ({
      ...prev,
      description: mapping.defaultDescription,
      tags: mapping.defaultTags,
      builderSections: mapping.defaultBuilderSections,
      domainData: getDefaultDomainData(customType)
    }));
    setMobileStep(2);
  };

  // ─── CORE IDENTITY FIELD HANDLERS (EDIT LABEL, EDIT VALUE, REMOVE, ADD) ───

  const handleCoreValueChange = (fieldId: string, val: string) => {
    setCoreFields(prev => prev.map(f => f.id === fieldId ? { ...f, value: val } : f));
  };

  const handleCoreLabelChange = (fieldId: string, newLabel: string) => {
    setCoreFields(prev => prev.map(f => f.id === fieldId ? { ...f, label: newLabel } : f));
  };

  const handleRemoveCoreField = (fieldId: string) => {
    sound.playClick();
    setCoreFields(prev => prev.filter(f => f.id !== fieldId));
  };

  const handleAddCoreField = (column: 1 | 2) => {
    sound.playClick();
    const newField: CoreIdentityField = {
      id: `f-core-${Date.now()}`,
      key: `custom_${Date.now()}`,
      label: `New Identity Field`,
      value: '',
      placeholder: 'Enter field value...',
      column,
      type: 'text'
    };
    setCoreFields(prev => [...prev, newField]);
  };

  // Copy QR token
  const handleCopyToken = () => {
    sound.playClick();
    navigator.clipboard.writeText(formData.uniqrCode);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Add Tag
  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  // Add Relationship
  const handleAddRelationship = () => {
    if (!newRelTargetId) return;
    const targetEntity = existingEntities.find(e => e.id === newRelTargetId);
    if (!targetEntity) return;

    sound.playClick();
    const newRel: EntityRelationship = {
      id: `rel-${Date.now()}`,
      sourceEntityId: formData.uniqrCode,
      targetEntityId: targetEntity.id,
      targetEntityType: targetEntity.entityType || 'product',
      targetEntityName: targetEntity.name,
      relationType: newRelType
    };

    setFormData(prev => ({
      ...prev,
      relationships: [...prev.relationships, newRel]
    }));
    setNewRelTargetId('');
  };

  // Remove Relationship
  const handleRemoveRelationship = (relId: string) => {
    sound.playClick();
    setFormData(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r.id !== relId)
    }));
  };

  // Final Save handler — maps all dynamic Core Fields seamlessly into Product
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sound.playSuccessChime();

    // Extract core values from dynamic fields
    const nameField = coreFields.find(f => f.key === 'name') || coreFields[0];
    const primaryIdField = coreFields.find(f => f.key === 'identityNumber') || coreFields.find(f => f.column === 1);
    const secIdField = coreFields.find(f => f.key === 'secondaryIdentifier');
    const authorityField = coreFields.find(f => f.key === 'organization');
    const locationField = coreFields.find(f => f.key === 'location');
    const statusField = coreFields.find(f => f.key === 'status');

    // Aggregate custom fields
    const resolvedCustomFields: Record<string, string> = { ...formData.customFields };
    coreFields.forEach(f => {
      if (f.label && f.value) {
        resolvedCustomFields[f.label] = f.value;
      }
    });

    const entityToSave: Product = {
      id: productToEdit?.id || `prod-${Date.now()}`,
      uniqrCode: formData.uniqrCode,
      name: nameField?.value || currentMapping.defaultName,
      sku: primaryIdField?.value || currentMapping.primaryIdExample,
      brand: authorityField?.value || currentMapping.defaultAuthority,
      manufacturer: authorityField?.value || currentMapping.defaultAuthority,
      supplier: authorityField?.value || currentMapping.defaultAuthority,
      description: formData.description,
      category: selectedEntityType,
      entityType: selectedEntityType,
      qrPurpose: selectedPurpose,
      identityNumber: primaryIdField?.value || currentMapping.primaryIdExample,
      secondaryIdentifier: secIdField?.value || currentMapping.secondaryIdExample,
      hsn: formData.domainData['hsn'] || '',
      gst: formData.domainData['gst'] ? Number(formData.domainData['gst']) : 18,
      batchNumber: secIdField?.value || currentMapping.secondaryIdExample,
      serialNumber: secIdField?.value || currentMapping.secondaryIdExample,
      mfgDate: formData.domainData['mfgDate'] || new Date().toISOString().split('T')[0],
      expDate: formData.domainData['expDate'] || '',
      warrantyMonths: formData.domainData['warrantyMonths'] ? Number(formData.domainData['warrantyMonths']) : 12,
      domainData: formData.domainData,
      customFields: resolvedCustomFields,
      builderSections: formData.builderSections,
      relationships: formData.relationships,
      connectedApps: productToEdit?.connectedApps || ['UniQR Studio', 'Enterprise ERP'],
      status: (statusField?.value?.split(' / ')[0] as any) || 'Active',
      createdAt: productToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags,
      location: locationField?.value || currentMapping.defaultLocation,
      organization: authorityField?.value || currentMapping.defaultAuthority,
      pdfDocument: pdfDocument || undefined,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      imageUrl: galleryImages[0]?.dataUrl || productToEdit?.imageUrl || undefined,
      websiteUrl: (contactChannels.find(c => c.type === 'url' || c.id === 'c-web' || c.label.toLowerCase().includes('web') || c.label.toLowerCase().includes('url'))?.value || '').trim() || undefined,
      contactPhone: (contactChannels.find(c => c.type === 'phone' || c.id === 'c-phone' || c.label.toLowerCase().includes('phone') || c.label.toLowerCase().includes('line'))?.value || '').trim() || undefined,
      contactEmail: (contactChannels.find(c => c.type === 'email' || c.id === 'c-email' || c.label.toLowerCase().includes('email') || c.label.toLowerCase().includes('mail'))?.value || '').trim() || undefined,
      longDescription: longDescription.trim() || formData.description || undefined
    };

    onSave(entityToSave);
  };

  // Filtered entity type definitions
  const allTypeMeta = Object.values(ENTITY_TYPE_DEFINITIONS) as EntityTypeMeta[];
  const filteredTypeDefinitions = allTypeMeta.filter(def => {
    const matchesCategory = typeCategoryFilter === 'All' || def.category.includes(typeCategoryFilter);
    return matchesCategory;
  });

  const allPurposeMeta = Object.values(QR_PURPOSE_DEFINITIONS);

  const wizardSteps = [
    { num: 1 as const, title: 'Classification & Purpose', desc: 'The "What & Why"' },
    { num: 2 as const, title: 'Core Identity Metadata', desc: 'The "Who & Where"' },
    { num: 3 as const, title: 'Dynamic Specifications', desc: 'The "Custom Data"' },
    { num: 4 as const, title: 'Network & Final Stamp', desc: 'The "Graph & Action"' },
  ];

  // Column 1 and Column 2 Core Fields
  const col1Fields = coreFields.filter(f => f.column === 1);
  const col2Fields = coreFields.filter(f => f.column === 2);
  const mobileStepTitles = [
    'Classification & Purpose',
    'Core Identity Fields',
    'Contact Channels & Links',
    'Media & PDF Attachments',
    'Dynamic Specifications',
    'Connected Intelligence & Graph',
    'Review & Final Stamp'
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ══════════════════════════════════════════════════════════════════
          MOBILE VIEW: 7-STEP PROGRESSIVE WORKSPACE (md:hidden)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3">
        
        {/* Mobile Header Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#F9D2BA] shadow-sm flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-black text-[#1D4533] leading-tight">
              {productToEdit ? 'Edit Entity' : 'Register Universal Entity'}
            </h1>
            <p className="text-[10px] text-[#5E3122] font-medium mt-0.5">
              Step {mobileStep} of 7: {mobileStepTitles[mobileStep - 1]}
            </p>
          </div>

          <button
            type="button"
            onClick={handleMobileAutoFillCustom}
            className="w-9 h-9 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F9D2BA] flex items-center justify-center shadow-sm border border-[#F9D2BA] shrink-0 transition-transform active:scale-95"
            title="Auto-Fill Custom Digital Entity & Jump to Identity"
          >
            <Wand2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Step Progress Indicator */}
        <div className="bg-white p-2.5 rounded-2xl border border-[#F9D2BA] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black text-[#1D4533]">
            <span>{mobileStepTitles[mobileStep - 1]}</span>
            <span className="text-[10px] text-[#5E3122] font-bold">{Math.round((mobileStep / 7) * 100)}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#F7EAE0] rounded-full overflow-hidden flex gap-0.5">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 rounded-full transition-all ${
                  s <= mobileStep ? 'bg-[#1D4533]' : 'bg-[#F9D2BA]/40'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {['1. Class', '2. Identity', '3. Contact', '4. Media', '5. Specs', '6. Graph', '7. Stamp'].map((name, idx) => (
              <button
                key={name}
                type="button"
                onClick={() => { sound.playClick(); setMobileStep(idx + 1); }}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold whitespace-nowrap transition-all shrink-0 ${
                  mobileStep === idx + 1
                    ? 'bg-[#1D4533] text-[#F7EAE0]'
                    : 'bg-[#F7EAE0]/60 text-[#5E3122]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Step Content Cards */}
        <div className="bg-white p-4 rounded-2xl border border-[#F9D2BA] shadow-sm space-y-3">
          
          {/* MOBILE STEP 1: CLASSIFICATION & QR PURPOSE DROPDOWNS */}
          {mobileStep === 1 && (
            <div className="space-y-3">
              {/* 1. Entity Classification Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#1D4533] flex items-center justify-between">
                  <span>Entity Classification</span>
                  <span className="text-[9px] text-[#5E3122] font-bold">Auto-Adapts Fields</span>
                </label>
                <select
                  value={selectedEntityType}
                  onChange={(e) => handleEntityTypeChange(e.target.value as EntityType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-black text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                >
                  <optgroup label="📦 Physical Goods">
                    <option value="product">Product / Manufactured Item</option>
                  </optgroup>
                  <optgroup label="⚙️ Operations & Industrial Assets">
                    <option value="machine">Industrial Machine Unit</option>
                    <option value="equipment">Equipment &amp; Tooling</option>
                    <option value="asset">Fixed &amp; Enterprise Asset</option>
                  </optgroup>
                  <optgroup label="🚚 Supply Chain & Facilities">
                    <option value="location">Warehouse Facility / Storage Hub</option>
                    <option value="batch">Manufacturing Batch / Stock Lot</option>
                    <option value="shipment">Logistics Shipment / Consignment</option>
                    <option value="event">Event / Expo / Conference Pass</option>
                  </optgroup>
                  <optgroup label="👥 People & Organizations">
                    <option value="customer">Customer / Enterprise Client</option>
                    <option value="employee">Employee / Field Technician</option>
                  </optgroup>
                  <optgroup label="📜 Documents, Care & Compliance">
                    <option value="document">Digital Document / SOP</option>
                    <option value="certificate">Compliance Certificate / Test Report</option>
                    <option value="warranty">Warranty &amp; Service Care Plan</option>
                    <option value="invoice">Tax Invoice / Commercial Bill</option>
                  </optgroup>
                  <optgroup label="⚡ Operations, Workflows & Custom">
                    <option value="process">Business Process &amp; Workflow</option>
                    <option value="process_step">Process Step / Quality Gate</option>
                    <option value="work_order">Work Order / Service Ticket</option>
                    <option value="service">Service Offering / AMC</option>
                    <option value="custom">Custom Dynamic Entity</option>
                  </optgroup>
                </select>
              </div>

              {/* 2. Select Operational QR Purpose Dropdown */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-black uppercase text-[#1D4533] flex items-center justify-between">
                  <span>Operational QR Purpose</span>
                  <span className="text-[9px] text-[#5E3122] font-bold">Action Intent</span>
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedPurpose(e.target.value as QrPurpose);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-black text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                >
                  <option value="identification">Digital Product Identity &amp; Profile</option>
                  <option value="access">Identity &amp; Access Verification</option>
                  <option value="authentication">Anti-Counterfeit &amp; Serial Verification</option>
                  <option value="traceability">Supply Chain &amp; Batch Traceability</option>
                  <option value="maintenance">Operations, Telemetry &amp; Maintenance</option>
                  <option value="documentation">Digital Document &amp; SOP Hub</option>
                  <option value="inventory">Asset Tracking &amp; Warehouse Audit</option>
                  <option value="payment">Universal Digital Payment Gateway</option>
                  <option value="verification">Tamper-Evident Certification</option>
                  <option value="custom">Custom Configured Workflow</option>
                </select>
              </div>

              {/* Rationale Pill */}
              <div className="p-2.5 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-[11px] text-[#5E3122]">
                <strong className="text-[#1D4533] font-bold">{selectedEntityType.toUpperCase()}</strong>: {currentMapping.purposeRationale}
              </div>
            </div>
          )}

          {/* MOBILE STEP 2: 3 CORE IDENTITY DETAILS */}
          {mobileStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-[#1D4533]">Core Identity (3 Essential Fields)</h3>
                  <span className="text-[9px] text-[#5E3122]">Primary attributes for mobile registration</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddCoreField(1)}
                  className="px-2 py-1 rounded-lg bg-[#1D4533] text-[#F7EAE0] font-bold text-[10px] flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Field</span>
                </button>
              </div>

              <div className="space-y-2">
                {coreFields.slice(0, 3).map((field, idx) => {
                  const isRequired = idx === 0 || field.key === 'name' || field.label.toLowerCase().includes('name');
                  return (
                    <div key={field.id} className="p-2.5 rounded-xl bg-[#F7EAE0]/30 border border-[#F9D2BA] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 flex-1">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleCoreLabelChange(field.id, e.target.value)}
                            className="font-black text-[#5E3122] uppercase text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                          />
                          {isRequired && (
                            <span className="text-red-600 font-black text-sm leading-none shrink-0" title="Required Field">*</span>
                          )}
                          <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCoreField(field.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {field.type === 'select' && field.options ? (
                        <select
                          value={field.value}
                          onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#F9D2BA] bg-white text-xs font-bold text-[#1D4533]"
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt.split(' / ')[0]}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                          placeholder={field.placeholder || 'Enter value...'}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#F9D2BA] bg-white text-xs text-[#1D4533] focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MOBILE STEP 3: FULLY CUSTOMIZABLE CONTACT CHANNELS & LINKS */}
          {mobileStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-[#1D4533]">Contact &amp; Web Links</h3>
                  <span className="text-[9px] text-[#5E3122]">Every channel can be renamed, edited, or deleted</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddContactChannel}
                  className="px-2 py-1 rounded-lg bg-[#1D4533] text-[#F7EAE0] font-bold text-[10px] flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Channel</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {contactChannels.map((channel) => {
                  let isFormatValid = true;
                  if (channel.type === 'url') isFormatValid = isValidUrl(channel.value);
                  else if (channel.type === 'email') isFormatValid = isValidEmail(channel.value);
                  else if (channel.type === 'phone') isFormatValid = isValidPhone(channel.value);

                  return (
                    <div key={channel.id} className="p-2.5 rounded-xl bg-[#F7EAE0]/30 border border-[#F9D2BA] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="text"
                            value={channel.label}
                            onChange={(e) => handleContactLabelChange(channel.id, e.target.value)}
                            className="font-black text-[#5E3122] uppercase text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                            title="Click to rename contact channel"
                          />
                          <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60 shrink-0" />
                        </div>
                        {channel.value && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isFormatValid ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
                          }`}>
                            {isFormatValid ? '✓ Valid' : '⚠️ Format'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveContactChannel(channel.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded shrink-0"
                          title="Delete channel"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <input
                        type={channel.type === 'email' ? 'email' : channel.type === 'phone' ? 'tel' : 'text'}
                        value={channel.value}
                        onChange={(e) => handleContactValueChange(channel.id, e.target.value)}
                        placeholder={channel.placeholder || 'Enter value...'}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#F9D2BA] bg-white text-xs text-[#1D4533] focus:outline-none"
                      />
                    </div>
                  );
                })}

                {/* Description Summary with Renameable Label */}
                <div className="p-2.5 rounded-xl bg-[#F7EAE0]/30 border border-[#F9D2BA] space-y-1 pt-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={descriptionLabel}
                      onChange={(e) => setDescriptionLabel(e.target.value)}
                      className="font-black text-[#5E3122] uppercase text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                      title="Click to rename description label"
                    />
                    <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60" />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Operational notes, summary, and instructions..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#F9D2BA] bg-white text-xs text-[#1D4533] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MOBILE STEP 4: MEDIA & PDF ATTACHMENTS */}
          {mobileStep === 4 && (
            <div className="space-y-4">
              {/* PDF Upload */}
              <div className="p-3 rounded-xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#1D4533]">
                    Official PDF Document (Max 10MB)
                  </span>
                  {pdfDocument && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Attached
                    </span>
                  )}
                </div>

                {pdfDocument ? (
                  <div className="p-2.5 rounded-lg bg-white border border-[#F9D2BA] flex items-center justify-between">
                    <div className="truncate">
                      <span className="font-bold text-xs text-[#1D4533] block truncate">{pdfDocument.name}</span>
                      <span className="text-[10px] text-[#5E3122]">{(pdfDocument.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPdfDocument(null)}
                      className="p-1 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-[#1D4533]/40 bg-white p-3 rounded-xl text-center block cursor-pointer">
                    <FileText className="w-5 h-5 text-[#5E3122] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#1D4533] block">Select PDF Document</span>
                    <span className="text-[9px] text-[#5E3122]/70 block">SOP, Certificate or Manual</span>
                    <input type="file" accept="application/pdf,.pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Image Upload */}
              <div className="p-3 rounded-xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#1D4533]">
                    Asset Images (Max 2 • 5MB Each)
                  </span>
                  <span className="text-[9px] font-bold text-[#5E3122]">{galleryImages.length}/2</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative rounded-lg border border-[#F9D2BA] overflow-hidden h-20 bg-white">
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryImages(prev => prev.filter(i => i.id !== img.id))}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {galleryImages.length < 2 && (
                    <label className="border border-dashed border-[#1D4533]/40 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer h-20 p-1 text-center">
                      <Plus className="w-4 h-4 text-[#5E3122]" />
                      <span className="text-[10px] font-bold text-[#1D4533]">Add Photo</span>
                      <span className="text-[8px] text-[#5E3122]/70">Max 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MOBILE STEP 5: SPECIFICATIONS & LONG NOTES */}
          {mobileStep === 5 && (
            <div className="space-y-4">
              <SectionFieldBuilder
                sections={formData.builderSections}
                onChangeSections={(updated: BuilderSection[]) => setFormData(prev => ({ ...prev, builderSections: updated }))}
              />

              <div className="space-y-1 pt-2 border-t border-[#F9D2BA]">
                <label className="text-[10px] font-black uppercase text-[#5E3122] block">
                  Extended SOP / Long Instructions
                </label>
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed multi-line instructions, safety standards, operating guides..."
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] text-xs text-[#1D4533] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* MOBILE STEP 6: CONNECTED INTELLIGENCE & GRAPH RELATIONSHIPS */}
          {mobileStep === 6 && (
            <div className="space-y-4">
              <div className="border-b border-[#F9D2BA] pb-2">
                <h3 className="text-xs font-black uppercase text-[#1D4533] flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-[#1D4533]" />
                  <span>Connected Intelligence &amp; Graph Links</span>
                </h3>
                <p className="text-[10px] text-[#5E3122]">
                  Link this entity into the enterprise knowledge network (e.g. Asset at Location, Component of Machine).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[#5E3122] block">
                    Relation Verb:
                  </label>
                  <select
                    value={newRelType}
                    onChange={(e) => setNewRelType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
                  >
                    <option value="OWNS">OWNS (Customer owns Product)</option>
                    <option value="LOCATED_AT">LOCATED_AT (Asset at Facility)</option>
                    <option value="MANUFACTURED_BY">MANUFACTURED_BY (Entity by OEM)</option>
                    <option value="SERVICED_BY">SERVICED_BY (Unit by Technician)</option>
                    <option value="PART_OF_BATCH">PART_OF_BATCH (Unit in Lot)</option>
                    <option value="CERTIFIED_BY">CERTIFIED_BY (Complies with ISO/CE)</option>
                    <option value="CONTAINS">CONTAINS (Parent contains Component)</option>
                    <option value="REQUIRES_WORK_ORDER">REQUIRES_WORK_ORDER (Task/Ticket)</option>
                    <option value="ASSIGNED_TO">ASSIGNED_TO (Tool to Operator)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[#5E3122] block">
                    Target Entity Node:
                  </label>
                  <select
                    value={newRelTargetId}
                    onChange={(e) => setNewRelTargetId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
                  >
                    <option value="">-- Choose Existing Entity --</option>
                    {existingEntities.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.name} ({ent.sku || ent.uniqrCode})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={!newRelTargetId}
                  onClick={handleAddRelationship}
                  className="w-full py-2 bg-[#1D4533] text-[#F7EAE0] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F9D2BA]" />
                  <span>Link Graph Connection</span>
                </button>
              </div>

              {formData.relationships.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#F9D2BA]/60">
                  <span className="text-[10px] font-black uppercase text-[#1D4533] block">
                    Active Links ({formData.relationships.length}):
                  </span>
                  <div className="space-y-1.5">
                    {formData.relationships.map((rel) => (
                      <div
                        key={rel.id}
                        className="p-2.5 rounded-xl bg-white border border-[#F9D2BA] flex items-center justify-between gap-2 shadow-2xs text-xs"
                      >
                        <div className="truncate flex items-center gap-1.5 min-w-0">
                          <LinkIcon className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                          <span className="font-mono text-[9px] font-black text-[#5E3122] bg-[#F7EAE0] px-1.5 py-0.5 rounded">
                            {rel.relationType}
                          </span>
                          <span className="font-extrabold text-[#1D4533] truncate">
                            {rel.targetEntityName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRelationship(rel.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded shrink-0"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MOBILE STEP 7: REVIEW & FINAL STAMP */}
          {mobileStep === 7 && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-[#1D4533] text-[#F7EAE0] space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#F9D2BA] mx-auto" />
                <h3 className="font-black text-sm text-[#F7EAE0]">Ready to Stamp Digital Identity</h3>
                <p className="text-[11px] text-[#F9D2BA]/90 font-mono">
                  Token: {formData.uniqrCode}
                </p>
                <div className="flex justify-center gap-2 text-[10px] text-[#F7EAE0]/80 pt-1 border-t border-[#F9D2BA]/20">
                  <span>Type: <strong>{selectedEntityType}</strong></span>
                  <span>•</span>
                  <span>Purpose: <strong>{selectedPurpose}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full py-3.5 rounded-2xl bg-[#1D4533] text-[#F9D2BA] hover:text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{productToEdit ? 'Save Entity Changes' : 'Register & Generate QR'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            disabled={mobileStep === 1}
            onClick={() => { sound.playClick(); setMobileStep(prev => Math.max(1, prev - 1)); }}
            className="flex-1 py-2.5 rounded-xl border border-[#F9D2BA] bg-white text-[#5E3122] font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {mobileStep < 7 ? (
            <button
              type="button"
              onClick={() => { sound.playClick(); setMobileStep(prev => Math.min(7, prev + 1)); }}
              className="flex-1 py-2.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#F9D2BA]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="flex-1 py-2.5 rounded-xl bg-[#1D4533] text-[#F9D2BA] font-black text-xs flex items-center justify-center gap-1 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Stamp</span>
            </button>
          )}
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP VIEW: 4-STEP POWER-USER WORKSPACE (hidden md:block)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block space-y-6">
        
        {/* ─── 1. TOP HEADER & QUICK ACTIONS ─── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#1D4533] font-extrabold text-xs uppercase tracking-wider mb-1">
              <button
                type="button"
                onClick={onCancel}
                className="hover:underline flex items-center gap-1 text-[#5E3122]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Inventory</span>
              </button>
              <span>/</span>
              <span>Universal Entity Creator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
              {productToEdit ? 'Edit Universal Entity Record' : 'Register New Universal Entity'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5E3122] mt-0.5 font-medium">
              Dynamic &amp; editable schema. All fields and section titles can be renamed with the pen icon, customized, or deleted. Nothing is fixed.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleLoadSmartPreset}
              className="px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs transition-all border border-[#F9D2BA] flex items-center gap-1.5 shadow-xs"
              title="Auto-fill recommended industry defaults for this entity classification"
            >
              <Wand2 className="w-4 h-4 text-[#5E3122]" />
              <span>✨ Auto-Fill Realistic Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-6 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#F9D2BA]" />
              <span>{productToEdit ? 'Save Changes' : 'Register & Save'}</span>
            </button>
          </div>
        </div>

        {/* ─── 2. 4-STEP PROGRESS STEPPER ─── */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F9D2BA] shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {wizardSteps.map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(step.num);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]'
                      : isCompleted
                      ? 'bg-[#F7EAE0]/70 text-[#1D4533] border-[#F9D2BA]'
                      : 'bg-white text-[#5E3122] border-[#F9D2BA]/60 hover:bg-[#F7EAE0]/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    isActive
                      ? 'bg-[#F9D2BA] text-[#1D4533]'
                      : isCompleted
                      ? 'bg-[#1D4533] text-[#F7EAE0]'
                      : 'bg-[#F7EAE0] text-[#5E3122]'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black block truncate leading-tight">{step.title}</span>
                    <span className={`text-[10px] font-medium block truncate ${isActive ? 'text-[#F9D2BA]' : 'text-[#5E3122]'}`}>
                      {step.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. STEP CONTENT WORKSPACE ─── */}
        <div className="space-y-6">

          {/* ══════════════════════════════════════════════════════════════════
              STEP 1: CLASSIFICATION & PURPOSE (THE "WHAT & WHY")
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
                
                {/* ⭐ MY CUSTOM SCHEMA TEMPLATES (ELEVATED TO TOP) */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/70 border border-[#F9D2BA] space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F9D2BA] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
                          ⭐ My Custom Schema Templates
                        </h3>
                        <span className="text-[10px] text-[#5E3122] font-semibold">
                          Your custom workflows appear on top for 1-click re-use
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveCurrentAsTemplate}
                      className="px-3 py-1.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-[11px] flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
                    >
                      <Save className="w-3.5 h-3.5 text-[#F9D2BA]" />
                      <span>Save Current as Template</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {customTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => handleApplyTemplate(tpl)}
                        className="p-3 rounded-xl bg-white border border-[#F9D2BA] hover:border-[#1D4533] shadow-xs cursor-pointer group transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-[#F7EAE0] text-[#1D4533]">
                              {tpl.category}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[#5E3122] hover:text-red-600 rounded transition-opacity"
                              title="Delete template"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <h4 className="font-extrabold text-xs text-[#1D4533] leading-snug group-hover:text-[#5E3122]">
                            {tpl.name}
                          </h4>
                          {tpl.description && (
                            <p className="text-[10px] text-[#5E3122] line-clamp-1">
                              {tpl.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 mt-2 border-t border-[#F9D2BA]/40 flex items-center justify-between text-[9px] font-bold text-[#5E3122]">
                          <span>{tpl.coreFields.length} Core Fields • {tpl.builderSections.length} Specs</span>
                          <span className="text-[#1D4533] group-hover:underline">Apply →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter by Category Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9D2BA] pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#1D4533]">
                      1. Choose Universal Entity Classification
                    </h2>
                    <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                      Select what you are digitizing. All fields will auto-adapt to fit the industry domain.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {['All', 'Physical', 'Operations', 'Supply Chain', 'People', 'Documents', 'Workflow'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setTypeCategoryFilter(cat);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          typeCategoryFilter === cat
                            ? 'bg-[#1D4533] text-[#F7EAE0] shadow-xs'
                            : 'bg-[#F7EAE0]/50 border border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entity Type Card Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {filteredTypeDefinitions.map((def) => {
                    const isSelected = selectedEntityType === def.id;
                    const Icon = def.icon;
                    return (
                      <button
                        key={def.id}
                        type="button"
                        onClick={() => handleEntityTypeChange(def.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]'
                            : 'bg-[#F7EAE0]/40 border-[#F9D2BA] hover:bg-white hover:border-[#1D4533]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="w-5 h-5" />
                          {isSelected && <Check className="w-4 h-4 text-[#F9D2BA]" />}
                        </div>
                        <div>
                          <span className="text-xs font-black block leading-tight">{def.label}</span>
                          <span className={`text-[9px] font-medium block truncate mt-0.5 ${isSelected ? 'text-[#F9D2BA]' : 'text-[#5E3122]'}`}>
                            {def.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Operational QR Purpose with Auto-Mapping Indicator */}
                <div className="pt-4 border-t border-[#F9D2BA] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1D4533] flex items-center gap-2">
                        <span>Operational QR Purpose</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1D4533] text-[#F9D2BA]">
                          Auto-Mapped
                        </span>
                      </h3>
                      <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                        {currentMapping.purposeRationale}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allPurposeMeta.map((pur) => {
                      const isSelected = selectedPurpose === pur.id;
                      const isAutoRecommended = currentMapping.suggestedPurpose === pur.id;
                      return (
                        <button
                          key={pur.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedPurpose(pur.id);
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm ring-1 ring-[#1D4533]'
                              : 'bg-white border-[#F9D2BA] hover:bg-[#F7EAE0]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-extrabold ${isSelected ? 'text-[#F9D2BA]' : 'text-[#1D4533]'}`}>
                                {pur.label}
                              </span>
                              {isAutoRecommended && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${isSelected ? 'bg-[#F9D2BA] text-[#1D4533]' : 'bg-[#1D4533] text-[#F7EAE0]'}`}>
                                  Suggested
                                </span>
                              )}
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F9D2BA]" />}
                          </div>
                          <p className={`text-[10px] mt-1 leading-snug font-medium ${isSelected ? 'text-[#F7EAE0]/90' : 'text-[#5E3122]'}`}>
                            {pur.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Next Step Nav */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continue to Core Identity (Step 2)</span>
                  <ChevronRight className="w-4 h-4 text-[#F9D2BA]" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STEP 2: CORE IDENTITY METADATA (FULLY EDITABLE & DELETABLE)
          ══════════════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9D2BA] pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#1D4533] flex items-center gap-2">
                      <span>2. Core Identity Metadata</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA]">
                        Fully Customizable
                      </span>
                    </h2>
                    <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                      Every field name has an edit pen sign <Edit3 className="w-3 h-3 inline text-[#5E3122]" /> to rename. You can delete unwanted fields or add new ones.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoadSmartPreset}
                    className="px-3 py-1.5 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto border border-[#F9D2BA]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to Industry Defaults</span>
                  </button>
                </div>

                {/* 2-Column Editable Dynamic Core Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Column 1 */}
                  <div className="space-y-4 p-5 rounded-2xl bg-[#F7EAE0]/30 border border-[#F9D2BA] flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="border-b border-[#F9D2BA]/60 pb-2 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
                          Column 1 Primary Identity ({col1Fields.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleAddCoreField(1)}
                          className="text-[11px] font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 bg-[#F9D2BA] hover:bg-[#F7EAE0] px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Field</span>
                        </button>
                      </div>

                      {col1Fields.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-[#F9D2BA] rounded-xl bg-white/60 text-[#5E3122]">
                          <p className="text-xs font-medium">No fields in Column 1.</p>
                          <button
                            type="button"
                            onClick={() => handleAddCoreField(1)}
                            className="mt-2 text-xs text-[#1D4533] font-bold underline"
                          >
                            + Add First Field
                          </button>
                        </div>
                      ) : (
                        col1Fields.map((field) => {
                          const isRequired = field.key === 'name' || field.label.toLowerCase().includes('name') || field.key === 'identityNumber' || field.label.toLowerCase().includes('primary');
                          return (
                            <div key={field.id} className="space-y-1 bg-white p-3 rounded-xl border border-[#F9D2BA]/80 shadow-2xs group/field">
                              
                              {/* Editable Field Label Header with Pen Sign & Delete */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 flex-1 min-w-0 bg-[#F7EAE0]/40 hover:bg-[#F7EAE0] px-1.5 py-0.5 rounded focus-within:bg-[#F7EAE0] border border-transparent focus-within:border-[#F9D2BA] transition-colors">
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => handleCoreLabelChange(field.id, e.target.value)}
                                    placeholder="Field Label"
                                    className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                                    title="Click to rename field label"
                                  />
                                  {isRequired && (
                                    <span className="text-red-600 font-black text-sm leading-none shrink-0" title="Required Field">*</span>
                                  )}
                                  <Edit3 className="w-3 h-3 text-[#5E3122] opacity-70 group-hover/field:opacity-100 shrink-0" />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveCoreField(field.id)}
                                  className="p-1 text-[#5E3122] hover:text-red-600 rounded transition-colors shrink-0"
                                  title="Delete this field"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Field Input (Select or Text) */}
                              {field.type === 'select' && field.options ? (
                                <select
                                  value={field.value}
                                  onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-[#F9D2BA] bg-white text-[#1D4533] font-bold text-xs focus:outline-none"
                                >
                                  {field.options.map((opt) => (
                                    <option key={opt} value={opt.split(' / ')[0]}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                                  placeholder={field.placeholder || 'Enter value...'}
                                  className="w-full px-3 py-2 rounded-lg border border-[#F9D2BA] bg-white text-[#1D4533] text-xs focus:outline-none focus:border-[#1D4533]"
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCoreField(1)}
                      className="w-full py-2 border border-dashed border-[#1D4533]/40 hover:border-[#1D4533] bg-white/50 hover:bg-white text-[#1D4533] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Field to Column 1</span>
                    </button>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4 p-5 rounded-2xl bg-[#F7EAE0]/30 border border-[#F9D2BA] flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="border-b border-[#F9D2BA]/60 pb-2 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
                          Column 2 Authority &amp; Logistics ({col2Fields.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleAddCoreField(2)}
                          className="text-[11px] font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 bg-[#F9D2BA] hover:bg-[#F7EAE0] px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Field</span>
                        </button>
                      </div>

                      {col2Fields.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-[#F9D2BA] rounded-xl bg-white/60 text-[#5E3122]">
                          <p className="text-xs font-medium">No fields in Column 2.</p>
                          <button
                            type="button"
                            onClick={() => handleAddCoreField(2)}
                            className="mt-2 text-xs text-[#1D4533] font-bold underline"
                          >
                            + Add First Field
                          </button>
                        </div>
                      ) : (
                        col2Fields.map((field) => {
                          const isRequired = field.key === 'identityNumber' || field.label.toLowerCase().includes('authority');
                          return (
                            <div key={field.id} className="space-y-1 bg-white p-3 rounded-xl border border-[#F9D2BA]/80 shadow-2xs group/field">
                              
                              {/* Editable Field Label Header with Pen Sign & Delete */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 flex-1 min-w-0 bg-[#F7EAE0]/40 hover:bg-[#F7EAE0] px-1.5 py-0.5 rounded focus-within:bg-[#F7EAE0] border border-transparent focus-within:border-[#F9D2BA] transition-colors">
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => handleCoreLabelChange(field.id, e.target.value)}
                                    placeholder="Field Label"
                                    className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                                    title="Click to rename field label"
                                  />
                                  {isRequired && (
                                    <span className="text-red-600 font-black text-sm leading-none shrink-0" title="Required Field">*</span>
                                  )}
                                  <Edit3 className="w-3 h-3 text-[#5E3122] opacity-70 group-hover/field:opacity-100 shrink-0" />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveCoreField(field.id)}
                                  className="p-1 text-[#5E3122] hover:text-red-600 rounded transition-colors shrink-0"
                                  title="Delete this field"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Field Input (Select or Text) */}
                              {field.type === 'select' && field.options ? (
                                <select
                                  value={field.value}
                                  onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-[#F9D2BA] bg-white text-[#1D4533] font-bold text-xs focus:outline-none"
                                >
                                  {field.options.map((opt) => (
                                    <option key={opt} value={opt.split(' / ')[0]}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => handleCoreValueChange(field.id, e.target.value)}
                                  placeholder={field.placeholder || 'Enter value...'}
                                  className="w-full px-3 py-2 rounded-lg border border-[#F9D2BA] bg-white text-[#1D4533] text-xs focus:outline-none focus:border-[#1D4533]"
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCoreField(2)}
                      className="w-full py-2 border border-dashed border-[#1D4533]/40 hover:border-[#1D4533] bg-white/50 hover:bg-white text-[#1D4533] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Field to Column 2</span>
                    </button>
                  </div>

                </div>

                {/* Read-Only Permanent QR Token with Quick Copy */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-[#5E3122] block tracking-wider">
                        Permanent SHA-256 QR Token (Auto-Generated &amp; Immutable)
                      </span>
                      <span className="font-mono text-sm font-black text-[#1D4533]">
                        {formData.uniqrCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        const freshCode = generateUniqueToken(storage.getProducts());
                        setFormData(prev => ({ ...prev, uniqrCode: freshCode }));
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      title="Generate a new random unique QR Token"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="px-4 py-2 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? 'Token Copied!' : 'Copy Token'}</span>
                    </button>
                  </div>
                </div>

                {/* Tags Manager */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Classification Tags</label>
                    <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl border border-[#F9D2BA] bg-[#F7EAE0]/30">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-[#1D4533] text-[#F7EAE0] text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-[#F9D2BA] hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                      <input
                        type="text"
                        placeholder="Add tag (Press Enter)..."
                        value={formData.tagInput}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 px-2.5 py-1 bg-white rounded-lg border border-[#F9D2BA] text-xs text-[#1D4533] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-1 bg-[#1D4533] text-[#F7EAE0] rounded-lg text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Description Summary</label>
                    <Edit3 className="w-3 h-3 text-[#5E3122] opacity-60" />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the entity, operational parameters, and specifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] text-xs focus:outline-none focus:border-[#1D4533]"
                  />
                </div>

                {/* ─── CONTACT CHANNELS & OFFICIAL PORTAL URL (CUSTOMIZABLE) ─── */}
                <div className="pt-4 border-t border-[#F9D2BA] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533] flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-[#5E3122]" />
                        <span>Contact Channels &amp; Web Resources ({contactChannels.length})</span>
                      </h3>
                      <p className="text-[10px] text-[#5E3122] font-semibold">
                        Public action links on the digital identity passport (customizable &amp; deletable)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddContactChannel}
                      className="px-3 py-1.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#5E3122] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#F9D2BA]" />
                      <span>Add Custom Channel</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {contactChannels.map((channel) => {
                      let isFormatValid = true;
                      if (channel.type === 'url') isFormatValid = isValidUrl(channel.value);
                      else if (channel.type === 'email') isFormatValid = isValidEmail(channel.value);
                      else if (channel.type === 'phone') isFormatValid = isValidPhone(channel.value);

                      return (
                        <div key={channel.id} className="p-3 rounded-xl bg-white border border-[#F9D2BA] shadow-2xs space-y-1.5 group/chan">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1 flex-1 min-w-0 bg-[#F7EAE0]/40 hover:bg-[#F7EAE0] px-1.5 py-0.5 rounded focus-within:bg-[#F7EAE0] border border-transparent focus-within:border-[#F9D2BA] transition-colors">
                              <input
                                type="text"
                                value={channel.label}
                                onChange={(e) => handleContactLabelChange(channel.id, e.target.value)}
                                className="font-black text-[#5E3122] uppercase tracking-wider text-[10px] bg-transparent focus:outline-none flex-1 truncate"
                                title="Click to rename contact channel"
                              />
                              <Edit3 className="w-3 h-3 text-[#5E3122] opacity-70 group-hover/chan:opacity-100 shrink-0" />
                            </div>
                            {channel.value && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                isFormatValid ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
                              }`}>
                                {isFormatValid ? '✓ Valid' : '⚠️ Format'}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveContactChannel(channel.id)}
                              className="p-1 text-[#5E3122] hover:text-red-600 rounded transition-colors shrink-0"
                              title="Delete channel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            type={channel.type === 'email' ? 'email' : channel.type === 'phone' ? 'tel' : 'text'}
                            placeholder={channel.placeholder || 'Enter value...'}
                            value={channel.value}
                            onChange={(e) => handleContactValueChange(channel.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#F9D2BA] bg-white text-xs text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── MEDIA & ATTACHMENTS (PDF Upto 10MB, Images Upto 5MB) ─── */}
                <div className="pt-4 border-t border-[#F9D2BA] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#5E3122]" />
                        <span>Media &amp; Official Document Attachments</span>
                      </h3>
                      <p className="text-[10px] text-[#5E3122] font-semibold">
                        Support for 1 Official PDF (up to 10MB) &amp; 2 Asset Images (up to 5MB each)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Official PDF Document Upload */}
                    <div className="p-4 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-[#1D4533] flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#5E3122]" />
                          <span>Official PDF Document (Max 10MB)</span>
                        </span>
                        {pdfDocument && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Attached
                          </span>
                        )}
                      </div>

                      {pdfDocument ? (
                        <div className="p-3 rounded-xl bg-white border border-[#F9D2BA] flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold shrink-0">
                              PDF
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-xs text-[#1D4533] block truncate">
                                {pdfDocument.name}
                              </span>
                              <span className="text-[10px] text-[#5E3122] font-medium">
                                {(pdfDocument.size / (1024 * 1024)).toFixed(2)} MB • Verified
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setPdfDocument(null);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="Remove PDF"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-[#1D4533]/30 hover:border-[#1D4533] bg-white/70 hover:bg-white p-4 rounded-xl text-center cursor-pointer transition-all block">
                          <FileText className="w-6 h-6 text-[#5E3122] mx-auto mb-1" />
                          <span className="text-xs font-bold text-[#1D4533] block">Upload Official PDF Document</span>
                          <span className="text-[10px] text-[#5E3122]/80 font-medium block mt-0.5">
                            SOP, Manual, Certificate, or Spec Sheet (Up to 10MB)
                          </span>
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Gallery Asset Images Upload */}
                    <div className="p-4 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-[#1D4533] flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-[#5E3122]" />
                          <span>Asset Gallery Images (Max 2 • 5MB Each)</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#5E3122]">
                          {galleryImages.length}/2 Images
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {galleryImages.map((img) => (
                          <div key={img.id} className="relative group rounded-xl border border-[#F9D2BA] overflow-hidden bg-white shadow-2xs h-24">
                            <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1.5">
                              <span className="text-[9px] text-white font-bold truncate">
                                {(img.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  setGalleryImages(prev => prev.filter(i => i.id !== img.id));
                                }}
                                className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {galleryImages.length < 2 && (
                          <label className="border-2 border-dashed border-[#1D4533]/30 hover:border-[#1D4533] bg-white/70 hover:bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all h-24 p-2 text-center">
                            <Plus className="w-5 h-5 text-[#5E3122] mb-0.5" />
                            <span className="text-[11px] font-bold text-[#1D4533]">Add Image</span>
                            <span className="text-[9px] text-[#5E3122]/70">Max 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── EXTENDED SOP & LONG TEXT INSTRUCTIONS ─── */}
                <div className="pt-4 border-t border-[#F9D2BA] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
                      Extended SOP / Long Instructions / Notes
                    </label>
                    <span className="text-[10px] text-[#5E3122] font-semibold">
                      {longDescription.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Detailed multi-line instructions, standard operating procedures, maintenance steps, safety guidelines..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] text-xs focus:outline-none focus:border-[#1D4533]"
                  />
                </div>

              </div>

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F7EAE0] font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(3);
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <span>Continue to Dynamic Specs (Step 3)</span>
                  <ChevronRight className="w-4 h-4 text-[#F9D2BA]" />
                </button>
              </div>
            </div>
          )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 3: DYNAMIC SPECIFICATIONS & SECTIONS (THE "CUSTOM DATA")
        ══════════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              
              <div className="border-b border-[#F9D2BA] pb-3">
                <h2 className="text-xl font-extrabold text-[#1D4533]">
                  3. Dynamic Specifications &amp; Custom Sections
                </h2>
                <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                  Categorize technical parameters, BOM details, compliance metrics, and inspection criteria.
                </p>
              </div>

              <SectionFieldBuilder
                sections={formData.builderSections}
                onChangeSections={(updated: BuilderSection[]) => {
                  setFormData(prev => ({
                    ...prev,
                    builderSections: updated
                  }));
                }}
              />

            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep(2);
                }}
                className="px-5 py-2.5 rounded-xl border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F7EAE0] font-bold text-xs flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Step 2</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep(4);
                }}
                className="px-6 py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <span>Continue to Graph Network (Step 4)</span>
                <ChevronRight className="w-4 h-4 text-[#F9D2BA]" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 4: NETWORK RELATIONSHIPS & FINAL STAMP (THE "GRAPH & ACTION")
        ══════════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
              
              <div className="border-b border-[#F9D2BA] pb-3">
                <h2 className="text-xl font-extrabold text-[#1D4533] flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#1D4533]" />
                  <span>4. Connected Intelligence &amp; Graph Relationships</span>
                </h2>
                <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                  Connect this entity into the enterprise knowledge graph (e.g. Machine contains Component, Batch belongs to Location).
                </p>
              </div>

              {/* Relationship Linker */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#5E3122]">
                      Link Relation Verb:
                    </label>
                    <select
                      value={newRelType}
                      onChange={(e) => setNewRelType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-xs font-extrabold text-[#1D4533] focus:outline-none"
                    >
                      <option value="OWNS">OWNS (Customer owns Product)</option>
                      <option value="LOCATED_AT">LOCATED_AT (Asset at Warehouse/Facility)</option>
                      <option value="MANUFACTURED_BY">MANUFACTURED_BY (Entity by OEM)</option>
                      <option value="SERVICED_BY">SERVICED_BY (Machine by Technician)</option>
                      <option value="PART_OF_BATCH">PART_OF_BATCH (Unit in Production Lot)</option>
                      <option value="CERTIFIED_BY">CERTIFIED_BY (Complies with ISO/CE)</option>
                      <option value="CONTAINS">CONTAINS (Parent contains Component)</option>
                      <option value="REQUIRES_WORK_ORDER">REQUIRES_WORK_ORDER (Maintenance Task)</option>
                      <option value="ASSIGNED_TO">ASSIGNED_TO (Tool to Operator)</option>
                    </select>
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#5E3122]">
                      Target Entity Node:
                    </label>
                    <select
                      value={newRelTargetId}
                      onChange={(e) => setNewRelTargetId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
                    >
                      <option value="">-- Choose Existing Entity to Link --</option>
                      {existingEntities.map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.name} ({ent.sku || ent.uniqrCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add Link Button */}
                  <button
                    type="button"
                    disabled={!newRelTargetId}
                    onClick={handleAddRelationship}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 shrink-0 mt-auto"
                  >
                    <Plus className="w-4 h-4 text-[#F9D2BA]" />
                    <span>Link Node</span>
                  </button>
                </div>

                {/* Active Graph Connections */}
                {formData.relationships.length > 0 && (
                  <div className="pt-3 border-t border-[#F9D2BA]/60 space-y-2">
                    <span className="text-xs font-extrabold text-[#1D4533]">Active Network Links ({formData.relationships.length}):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {formData.relationships.map((rel) => (
                        <div
                          key={rel.id}
                          className="p-3 rounded-2xl bg-white border border-[#F9D2BA] flex items-center justify-between gap-3 shadow-xs text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <LinkIcon className="w-4 h-4 text-[#1D4533] shrink-0" />
                            <div className="truncate">
                              <span className="font-mono text-[10px] font-black text-[#5E3122] bg-[#F7EAE0] px-1.5 py-0.5 rounded mr-1.5">
                                {rel.relationType}
                              </span>
                              <span className="font-extrabold text-[#1D4533] truncate">
                                {rel.targetEntityName}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveRelationship(rel.id)}
                            className="p-1 text-[#5E3122] hover:text-red-600 rounded"
                            title="Remove Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Final Action Bar with Permanent SHA-256 Confirmation */}
            <div className="bg-[#1D4533] p-6 sm:p-8 rounded-3xl border border-[#F9D2BA]/30 text-[#F7EAE0] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#F9D2BA]" />
                  <h3 className="text-lg font-black text-[#F7EAE0]">
                    Cryptographic SHA-256 Verification Stamp
                  </h3>
                </div>
                <p className="text-xs text-[#F9D2BA]/90 font-medium">
                  Permanent immutable record under Token: <strong className="font-mono text-white bg-black/20 px-2 py-0.5 rounded">{formData.uniqrCode}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(3);
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#5E3122] hover:bg-[#5E3122]/80 text-[#F7EAE0] font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Step 3</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-8 py-3.5 rounded-2xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-black text-xs transition-all shadow-md flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Register & Save Universal Entity'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>

  </div>
);
};
