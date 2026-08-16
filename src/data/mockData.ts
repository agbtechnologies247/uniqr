import { Product, QrCodeRecord, GraphNode, GraphLink, ScanEvent, SubscriptionTier, ApiKeyRecord, AuditLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-uqr-001',
    uniqrCode: 'UQR-PROD-000001',
    name: 'AGB HydroMax 500 Industrial Water Pump',
    sku: 'HM500-IND',
    brand: 'AGB Industrial Equipment Ltd.',
    manufacturer: 'AGB Industrial Equipment Ltd.',
    description: 'Flagship 5 HP 415V stainless steel industrial water pump with tamper-evident digital identity passport.',
    category: 'Industrial Machinery',
    hsn: '84137010',
    gst: 18,
    batchNumber: 'BATCH-2026-HM500',
    serialNumber: 'HM500-2026-000847',
    mfgDate: '2026-07-12',
    expDate: '2036-07-12',
    warrantyMonths: 24,
    entityType: 'product',
    identityNumber: 'HM500-IND',
    secondaryIdentifier: 'HM500-2026-000847',
    qrPurpose: 'authentication',
    customFields: {
      'Power Rating': '5 HP (3.7 kW)',
      'Operating Voltage': '415V 3-Phase',
      'Flow Capacity': '500 LPM (Liters Per Minute)',
      'Operating Pressure': '10 bar',
      'Material': 'Stainless Steel 316',
      'GPS Location': '18.5204° N, 73.8567° E (Pune Plant)',
      'Customer Record': 'UQR-CUST-000001 (ABC Heavy Industries)',
      'Installed Asset': 'UQR-AST-000008 (Utility Section Bay 4)',
      'Work Order': 'UQR-WO-000004 (Quarterly Calibration)'
    },
    builderSections: [
      {
        id: 'sec-specifications',
        title: 'Technical & Engineering Specifications',
        category: 'Details',
        fields: [
          { id: 'f-name', name: 'Product Name', type: 'Text', value: 'AGB HydroMax 500', validation: { required: true, isPublic: true } },
          { id: 'f-sku', name: 'SKU Identifier', type: 'Barcode', value: 'HM500-IND', validation: { required: true, isPublic: true } },
          { id: 'f-serial', name: 'Serial Number', type: 'Text', value: 'HM500-2026-000847', validation: { required: true, isPublic: true } },
          { id: 'f-power', name: 'Motor Power Rating', type: 'Dropdown', value: '5 HP (3.7 kW)', validation: { options: ['3 HP', '5 HP', '10 HP', '15 HP'], isPublic: true } },
          { id: 'f-voltage', name: 'Operating Voltage', type: 'Text', value: '415V 3-Phase', validation: { isPublic: true } },
          { id: 'f-flow', name: 'Flow Rate Capacity', type: 'Number', value: 500, validation: { min: 50, max: 5000, isPublic: true } },
          { id: 'f-pressure', name: 'Max Pressure', type: 'Number', value: 10, validation: { isPublic: true } }
        ]
      },
      {
        id: 'sec-commercial',
        title: 'Commercial & Warranty Details',
        category: 'Details',
        fields: [
          { id: 'f-price', name: 'MRP Price', type: 'Currency', value: 85000, validation: { currency: 'INR', isPublic: true } },
          { id: 'f-hsn', name: 'HSN Code', type: 'Text', value: '84137010', validation: { isPublic: true } },
          { id: 'f-gst', name: 'GST Tax Rate', type: 'Percentage', value: 18, validation: { isPublic: true } },
          { id: 'f-purchase', name: 'Purchase Date', type: 'Date', value: '2026-08-01', validation: { isPublic: true } },
          { id: 'f-warranty', name: 'Warranty Term', type: 'Dropdown', value: '24 Months Standard', validation: { options: ['12 Months', '24 Months', '36 Months'], isPublic: true } }
        ]
      },
      {
        id: 'sec-relationships',
        title: 'Universal Relationship Graph Network',
        category: 'Details',
        fields: [
          { id: 'f-rel-cust', name: 'Customer Entity', type: 'Relation', value: 'UQR-CUST-000001 (ABC Heavy Industries)', validation: { isPublic: true } },
          { id: 'f-rel-asset', name: 'Installed Location', type: 'Relation', value: 'UQR-LOC-000011 (Pune Logistics Bay 4)', validation: { isPublic: true } },
          { id: 'f-rel-wo', name: 'Work Order Record', type: 'Relation', value: 'UQR-WO-000004 (Maintenance)', validation: { isPublic: true } },
          { id: 'f-rel-gps', name: 'GPS Location Tag', type: 'GPS Location', value: '18.5204° N, 73.8567° E', validation: { isPublic: true } }
        ]
      }
    ],
    trailEvents: [
      {
        id: 'evt-uqr-101',
        qrId: 'UQR-PROD-000001',
        type: 'Manufactured & Registered',
        module: 'Manufacturing',
        timestamp: '2026-07-12T10:00:00Z',
        location: 'AGB Chakan Assembly Plant 1, Pune',
        department: 'Assembly',
        user: 'qa.lead@agbtechnologies.in',
        erpTask: 'ERP-MFG-2026-9041',
        digitalSignature: 'SIG-8812A09B',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: '0x8f4a2b91e70c483a992d11e5f884b92e',
        details: { Inspector: 'Rajesh Sharma', PressureTest: '10 Bar PASS' }
      },
      {
        id: 'evt-uqr-102',
        qrId: 'UQR-PROD-000001',
        type: 'Dispatched to Customer',
        module: 'Logistics',
        timestamp: '2026-08-01T09:00:00Z',
        location: 'AGB Pune Central Logistics Warehouse',
        department: 'Dispatch',
        user: 'dispatch@agbtechnologies.in',
        erpTask: 'ERP-WH-8841',
        digitalSignature: 'SIG-44910FA1',
        previousHash: '0x8f4a2b91e70c483a992d11e5f884b92e',
        currentHash: '0x14a991823719028a381e4b227777d4dd',
        details: { Carrier: 'Apex Global Logistics', Waybill: 'WB-2026-00481' }
      },
      {
        id: 'evt-uqr-103',
        qrId: 'UQR-PROD-000001',
        type: 'Installed & Commissioned',
        module: 'Quality',
        timestamp: '2026-08-03T14:21:00Z',
        location: 'ABC Heavy Industries Pune Plant Bay 4',
        department: 'Service Engineering',
        user: 'field.service@agbtechnologies.in',
        erpTask: 'ERP-WO-00481',
        digitalSignature: 'SIG-90B18821',
        previousHash: '0x14a991823719028a381e4b227777d4dd',
        currentHash: '0xef2d127de37b942baad06145e54b0c61',
        details: { CommissioningStatus: 'VERIFIED_ACTIVE', Engineer: 'Vikram Joshi' }
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    tags: ['HydroMax', 'Industrial', 'WaterPump', 'UniQR'],
    location: 'ABC Heavy Industries Pune Plant',
    supplier: 'AGB Industrial Equipment Ltd.',
    status: 'Active',
    createdAt: '2026-07-12T10:00:00Z',
    updatedAt: '2026-08-13T12:00:00Z',
    connectedApps: ['UniQR Studio', 'Enterprise ERP', 'Neo4j Graph Engine', 'Warranty Registry']
  },
  {
    id: 'prod-1',
    uniqrCode: 'UQ-8AF92B7A2',
    name: 'AERO-X Pro Fitness Dumbbell (20kg)',
    sku: 'AGB-FT-DB20',
    brand: 'UniQR Industrial',
    manufacturer: 'AGB Technologies Ltd',
    description: 'Precision forged steel dumbbell with anti-slip knurled grip and smart NFC/QR identity chip.',
    category: 'Fitness Equipment',
    hsn: '95069190',
    gst: 18,
    batchNumber: 'BATCH-2026-08A',
    serialNumber: 'SN-DB20-9941',
    mfgDate: '2026-06-15',
    expDate: '2036-06-15',
    warrantyMonths: 36,
    entityType: 'product',
    identityNumber: 'AGB-FT-DB20',
    secondaryIdentifier: 'SN-DB20-9941',
    qrPurpose: 'authentication',
    customFields: {
      'Price (₹)': '₹12,000',
      'Weight Tolerance': '±10 grams',
      'Coating': 'Polyurethane Vulcanized',
      'Ecosystem Target': 'Commercial Gym Fleet'
    },
    builderSections: [
      {
        id: 'sec-info',
        title: 'Product Information',
        category: 'Details',
        fields: [
          { id: 'f-name', name: 'Product Name', type: 'Text', value: 'AERO-X Pro Fitness Dumbbell (20kg)', validation: { required: true, isPublic: true } },
          { id: 'f-sku', name: 'SKU Code', type: 'Barcode', value: 'AGB-FT-DB20', validation: { required: true, isPublic: true } },
          { id: 'f-serial', name: 'Serial Number', type: 'Text', value: 'SN-DB20-9941', validation: { required: true, isPublic: true } }
        ]
      },
      {
        id: 'sec-pricing',
        title: 'Pricing & Financials',
        category: 'Details',
        fields: [
          { id: 'f-mrp', name: 'MRP', type: 'Currency', value: 12000, validation: { currency: 'INR', isPublic: true } },
          { id: 'f-gst', name: 'GST Percentage', type: 'Percentage', value: 18, validation: { isPublic: true } },
          { id: 'f-warranty', name: 'Warranty Period', type: 'Text', value: '3 Years Comprehensive', validation: { isPublic: true } }
        ]
      }
    ],
    trailEvents: [
      {
        id: 'evt-101',
        qrId: 'UQ-8AF92B7A2',
        type: 'Manufactured & Passed QA',
        module: 'Manufacturing',
        timestamp: '2026-06-15T08:30:00Z',
        location: 'Pune Plant Line 1',
        department: 'Production',
        user: 'qa.lead@agbtechnologies.in',
        erpTask: 'ERP-MFG-8810',
        digitalSignature: 'SIG-8F12A09B',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        details: { Inspector: 'Rajesh Kumar', Result: 'PASS' }
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80',
    tags: ['Fitness', 'UniQR', 'Commercial', 'Precision'],
    location: 'Warehouse A-12, Bengaluru',
    supplier: 'Metallix Industries',
    status: 'Active',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-15T14:30:00Z',
    connectedApps: ['UniQR Platform', 'Enterprise ERP', 'Warranty Registry']
  },
  {
    id: 'ent-mach-003',
    uniqrCode: 'UQR-MACH-000003',
    name: '5-Axis Industrial CNC Machining Center V500',
    sku: 'MACH-CNC-V500',
    brand: 'Siemens Industrial Automation',
    manufacturer: 'Siemens AG / AGB Integration',
    description: 'High precision 5-axis CNC milling center with real-time spindle vibration monitoring and IoT telemetry.',
    category: 'Industrial Machine',
    hsn: '84571010',
    gst: 18,
    batchNumber: 'BATCH-2025-CNC',
    serialNumber: 'SN-CNC500-0921',
    mfgDate: '2025-03-10',
    expDate: '2040-03-10',
    warrantyMonths: 60,
    entityType: 'machine',
    identityNumber: 'MACH-CNC-V500',
    secondaryIdentifier: 'SN-CNC500-0921',
    qrPurpose: 'maintenance',
    customFields: {
      'Power Rating': '45 kW 380V 3-Phase',
      'Spindle Speed': '18,000 RPM',
      'Max Axis Travel': 'X:1050mm Y:800mm Z:600mm',
      'Coolant System': 'High-Pressure 70 Bar Through-Spindle',
      'Calibration Cycle': '90 Days',
      'Last Maintenance': '2026-06-15'
    },
    relationships: [
      { id: 'r1', sourceEntityId: 'UQR-MACH-000003', targetEntityId: 'UQR-LOC-000011', targetEntityName: 'Pune Chakan Plant Bay 3', targetEntityType: 'location', relationType: 'LOCATED_AT' },
      { id: 'r2', sourceEntityId: 'UQR-MACH-000003', targetEntityId: 'UQR-WO-000004', targetEntityName: 'Quarterly Maintenance WO', targetEntityType: 'work_order', relationType: 'REQUIRES_WORK_ORDER' }
    ],
    trailEvents: [
      {
        id: 'evt-m1',
        qrId: 'UQR-MACH-000003',
        type: 'Commissioned & Factory Calibrated',
        module: 'Quality',
        timestamp: '2025-03-15T09:00:00Z',
        location: 'Siemens Integration Facility',
        user: 'qa.lead@siemens.in',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
      }
    ],
    status: 'Active',
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z',
    tags: ['Machine', 'CNC', 'Siemens', 'CriticalAsset'],
    location: 'Chakan Assembly Bay 3',
    supplier: 'Siemens AG',
    connectedApps: ['SCADA Network', 'Enterprise ERP', 'Predictive Maintenance']
  },
  {
    id: 'ent-doc-013',
    uniqrCode: 'UQR-DOC-000013',
    name: 'ISO 9001:2015 Quality & Safety SOP Manual',
    sku: 'DOC-SOP-QA-2026',
    brand: 'AGB Compliance Directorate',
    manufacturer: 'AGB Technologies Ltd',
    description: 'Official controlled standard operating procedure for precision assembly and multi-stage QA gates.',
    category: 'Digital Document',
    hsn: '49011010',
    gst: 0,
    batchNumber: 'REV-3.2',
    serialNumber: 'DOC-CTRL-88419',
    mfgDate: '2026-01-01',
    expDate: '2027-01-01',
    warrantyMonths: 12,
    entityType: 'document',
    identityNumber: 'DOC-SOP-QA-2026',
    secondaryIdentifier: 'v3.2.0-RELEASE',
    qrPurpose: 'documentation',
    customFields: {
      'Document Version': 'v3.2.0 (Approved)',
      'Document Class': 'Standard Operating Procedure (SOP)',
      'Author': 'QA Compliance Directorate',
      'Approver': 'Dr. V. K. Mehta (Chief Operations Officer)',
      'SHA-256 Hash': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      'Download URL': 'https://agbtechnologies.com/docs/sop-qa-2026.pdf'
    },
    relationships: [
      { id: 'r3', sourceEntityId: 'UQR-DOC-000013', targetEntityId: 'UQR-MACH-000003', targetEntityName: '5-Axis CNC Center', targetEntityType: 'machine', relationType: 'ASSOCIATED_WITH' }
    ],
    status: 'Active',
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    tags: ['Document', 'SOP', 'ISO9001', 'Compliance'],
    location: 'Digital Vault',
    supplier: 'AGB Compliance',
    connectedApps: ['Document Management', 'Audit Trail', 'Cloud Archive']
  },
  {
    id: 'ent-wo-004',
    uniqrCode: 'UQR-WO-000004',
    name: 'Quarterly Spindle Calibration & Overhaul Work Order',
    sku: 'WO-2026-Q3-0941',
    brand: 'AGB Field Engineering',
    manufacturer: 'AGB Technologies Ltd',
    description: 'Scheduled preventive maintenance and laser interferometry calibration work order ticket.',
    category: 'Work Order',
    hsn: '998719',
    gst: 18,
    batchNumber: 'WO-JOB-0941',
    serialNumber: 'WO-TICK-00481',
    mfgDate: '2026-08-01',
    expDate: '2026-08-15',
    warrantyMonths: 0,
    entityType: 'work_order',
    identityNumber: 'WO-2026-Q3-0941',
    secondaryIdentifier: 'WO-TICK-00481',
    qrPurpose: 'maintenance',
    customFields: {
      'Priority': 'P2 - High Scheduled',
      'Assigned Technician': 'Vikram Joshi (Senior Field Specialist)',
      'Target Machine': 'UQR-MACH-000003 (CNC Milling Center)',
      'Estimated Hours': '6 Hours',
      'Status': 'In Progress / Assigned',
      'Required Parts': 'Laser Alignment Kit, Spindle Bearing Seal 40mm, Synthetic ISO VG 68'
    },
    relationships: [
      { id: 'r4', sourceEntityId: 'UQR-WO-000004', targetEntityId: 'UQR-MACH-000003', targetEntityName: '5-Axis CNC Center', targetEntityType: 'machine', relationType: 'REQUIRES_WORK_ORDER' }
    ],
    status: 'Under Inspection',
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-08-14T11:00:00Z',
    tags: ['WorkOrder', 'Maintenance', 'P2', 'FieldService'],
    location: 'Chakan Assembly Bay 3',
    supplier: 'AGB Field Ops',
    connectedApps: ['Enterprise ERP', 'Field Mobility App']
  },
  {
    id: 'ent-cert-014',
    uniqrCode: 'UQR-CERT-000014',
    name: 'TÜV Rheinland CE Conformity & Calibration Certificate',
    sku: 'CERT-TUV-2026-88',
    brand: 'TÜV Rheinland India',
    manufacturer: 'TÜV Rheinland Group',
    description: 'Official European CE Machinery Directive 2006/42/EC and ISO 12100 safety compliance accreditation certificate.',
    category: 'Compliance Certificate',
    hsn: '998334',
    gst: 18,
    batchNumber: 'CERT-REG-2026',
    serialNumber: 'TUV-IN-2026-00481',
    mfgDate: '2025-05-10',
    expDate: '2028-05-09',
    warrantyMonths: 36,
    entityType: 'certificate',
    identityNumber: 'CERT-TUV-2026-88',
    secondaryIdentifier: 'ISO 9001:2015 & CE Directive',
    qrPurpose: 'verification',
    customFields: {
      'Certifying Authority': 'TÜV Rheinland India Pvt. Ltd.',
      'Applicable Standards': 'ISO 9001:2015, CE Directive 2006/42/EC, EN ISO 12100:2010',
      'Accreditation ID': 'NABCB-QM-004',
      'Certificate Validity': 'Active (Valid through 09 May 2028)',
      'Digital Signature Hash': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    relationships: [
      { id: 'r5', sourceEntityId: 'UQR-CERT-000014', targetEntityId: 'UQR-PROD-000001', targetEntityName: 'AGB HydroMax 500', targetEntityType: 'product', relationType: 'CERTIFIED_BY' }
    ],
    status: 'Active',
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
    tags: ['Certificate', 'TUV', 'CE', 'ISO9001'],
    location: 'Compliance Vault',
    supplier: 'TÜV Rheinland',
    connectedApps: ['Compliance Portal', 'Audit Registry']
  },
  {
    id: 'ent-loc-011',
    uniqrCode: 'UQR-LOC-000011',
    name: 'AGB Central Logistics Hub - Bay 4 (Pune)',
    sku: 'LOC-PN-BAY4',
    brand: 'AGB Infrastructure Ltd',
    manufacturer: 'AGB Technologies Ltd',
    description: 'High-throughput logistics sorting and automated warehouse storage zone equipped with RFID and UniQR gateways.',
    category: 'Location / Facility',
    hsn: '996711',
    gst: 18,
    batchNumber: 'FAC-PUN-01',
    serialNumber: 'LOC-GPS-PN48',
    mfgDate: '2024-01-01',
    expDate: '2044-01-01',
    warrantyMonths: 240,
    entityType: 'location',
    identityNumber: 'LOC-PN-BAY4',
    secondaryIdentifier: '18.7606° N, 73.8567° E',
    qrPurpose: 'access',
    customFields: {
      'Facility Type': 'Automated Warehouse Storage Bay',
      'Address': 'Plot 48, Chakan Industrial Area Phase II',
      'City / State': 'Pune, Maharashtra (410501)',
      'GPS Coordinates': '18.7606° N, 73.8567° E',
      'Pallet Capacity': '850 Heavy Pallets',
      'Access Clearance': 'Security Clearance Level II'
    },
    relationships: [
      { id: 'r6', sourceEntityId: 'UQR-LOC-000011', targetEntityId: 'UQR-MACH-000003', targetEntityName: '5-Axis CNC Center', targetEntityType: 'machine', relationType: 'CONTAINS' }
    ],
    status: 'Active',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2026-08-01T12:00:00Z',
    tags: ['Location', 'Warehouse', 'Chakan', 'Logistics'],
    location: 'Pune Chakan Phase II',
    supplier: 'AGB Facilities',
    connectedApps: ['WMS Warehouse System', 'RFID Gate Controller']
  },
  {
    id: 'ent-ast-008',
    uniqrCode: 'UQR-AST-000008',
    name: 'Enterprise AI GPU Compute Rack Node A100',
    sku: 'AST-IT-2026-881',
    brand: 'NVIDIA / AGB Infrastructure',
    manufacturer: 'NVIDIA Corporation',
    description: 'High-density enterprise AI compute rack node dedicated to telemetry indexing, predictive maintenance, and real-time model inference.',
    category: 'Enterprise Asset',
    hsn: '84715000',
    gst: 18,
    batchNumber: 'AST-IT-RACK4',
    serialNumber: 'CAPEX-GL-40192',
    mfgDate: '2025-11-20',
    expDate: '2035-11-20',
    warrantyMonths: 60,
    entityType: 'asset',
    identityNumber: 'AST-IT-2026-881',
    secondaryIdentifier: 'CAPEX-GL-40192',
    qrPurpose: 'inventory',
    customFields: {
      'Compute Architecture': '8x NVIDIA A100 80GB SXM4',
      'Network Fabric': 'NVIDIA Quantum InfiniBand 200Gbps',
      'Asset Custodian': 'R&D Infrastructure Group',
      'Depreciation Schedule': '5-Year Straight Line (20% p.a.)',
      'Physical Rack Position': 'Pune Tech Hub Rack R-08'
    },
    relationships: [
      { id: 'r7', sourceEntityId: 'UQR-AST-000008', targetEntityId: 'UQR-LOC-000011', targetEntityName: 'Pune Central Hub', targetEntityType: 'location', relationType: 'LOCATED_AT' }
    ],
    status: 'Active',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2026-07-15T16:00:00Z',
    tags: ['Asset', 'AI', 'Compute', 'NVIDIA'],
    location: 'Pune Tech Center Server Room',
    supplier: 'NVIDIA Solutions',
    connectedApps: ['IT Asset Registry', 'Cluster Telemetry']
  },
  {
    id: 'ent-bat-009',
    uniqrCode: 'UQR-BAT-000009',
    name: 'Manufacturing Lot — HydroMax 500 (1,000 Units)',
    sku: 'BATCH-2026-08-HM500',
    brand: 'AGB Industrial Equipment Ltd.',
    manufacturer: 'Chakan Assembly Line 2',
    description: 'Verified production lot of 1,000 precision pump assemblies with heat batch traceability and raw material metallurgical test certificates.',
    category: 'Production Batch',
    hsn: '84137010',
    gst: 18,
    batchNumber: 'BATCH-2026-08-HM500',
    serialNumber: 'QC-REL-9921',
    mfgDate: '2026-08-01',
    expDate: '2036-08-01',
    warrantyMonths: 24,
    entityType: 'batch',
    identityNumber: 'BATCH-2026-08-HM500',
    secondaryIdentifier: 'QC-REL-9921',
    qrPurpose: 'traceability',
    customFields: {
      'Batch Quantity': '1,000 Units',
      'Raw Steel Heat #': 'HT-8820 (AISI-316L)',
      'QA Release Status': '100% Passed (Zero Defect)',
      'Lead QC Engineer': 'Rajesh Sharma (Senior QA Lead)',
      'Holding Location': 'Chakan Warehouse Bay A'
    },
    relationships: [
      { id: 'r8', sourceEntityId: 'UQR-BAT-000009', targetEntityId: 'UQR-PROD-000001', targetEntityName: 'AGB HydroMax 500', targetEntityType: 'product', relationType: 'CONTAINS' }
    ],
    status: 'Active',
    createdAt: '2026-08-01T06:00:00Z',
    updatedAt: '2026-08-05T18:00:00Z',
    tags: ['Batch', 'Production', 'Lot', 'Chakan'],
    location: 'Chakan Line 2 Holding Bay',
    supplier: 'AGB Manufacturing',
    connectedApps: ['ERP Batch Genealogy', 'QA Lab Registry']
  },
  {
    id: 'ent-shp-010',
    uniqrCode: 'UQR-SHP-000010',
    name: 'Express Consignment AWB-881920 (250x HydroMax Pumps)',
    sku: 'AWB-EXP-881920',
    brand: 'Apex Global Freight Lines',
    manufacturer: 'Apex Logistics Services',
    description: 'Insured road logistics consignment of 250 HydroMax pumps in transit from Pune Hub to Ahmedabad Industrial Distribution Center.',
    category: 'Consignment / Freight',
    hsn: '996511',
    gst: 18,
    batchNumber: 'CARRIER-APEX-901',
    serialNumber: 'AWB-EXP-881920',
    mfgDate: '2026-08-10',
    expDate: '2026-08-20',
    warrantyMonths: 0,
    entityType: 'shipment',
    identityNumber: 'AWB-EXP-881920',
    secondaryIdentifier: 'CARRIER-APEX-901',
    qrPurpose: 'traceability',
    customFields: {
      'Carrier Name': 'Apex Express Road Logistics',
      'Origin Hub': 'Pune Central Logistics Depot',
      'Destination': 'ABC Heavy Industries Ahmedabad Facility',
      'Transit Status': 'In Transit (On-Schedule)',
      'Temperature Logging': 'Ambient Monitored (22°C)'
    },
    relationships: [
      { id: 'r9', sourceEntityId: 'UQR-SHP-000010', targetEntityId: 'UQR-PROD-000001', targetEntityName: 'AGB HydroMax 500', targetEntityType: 'product', relationType: 'CONTAINS' }
    ],
    status: 'Active',
    createdAt: '2026-08-10T08:00:00Z',
    updatedAt: '2026-08-14T15:30:00Z',
    tags: ['Shipment', 'Logistics', 'Freight', 'Transit'],
    location: 'Bhiwandi Central Logistics Hub',
    supplier: 'Apex Freight Lines',
    connectedApps: ['Fleet Telematics', 'Logistics Portal']
  },
  {
    id: 'ent-cust-001',
    uniqrCode: 'UQR-CUST-000001',
    name: 'ABC Heavy Industries Pvt. Ltd.',
    sku: 'CUST-ABC-MFG-27AABCA',
    brand: 'ABC Heavy Industries Group',
    manufacturer: 'ABC Heavy Industries',
    description: 'Tier-1 industrial manufacturing partner and enterprise client operating connected machine fleets with UniQR.',
    category: 'Enterprise Client',
    hsn: '998311',
    gst: 18,
    batchNumber: 'ACC-2026-9041',
    serialNumber: 'GST-27AABCA8841Z1',
    mfgDate: '2020-01-01',
    expDate: '2030-01-01',
    warrantyMonths: 120,
    entityType: 'customer',
    identityNumber: 'CUST-ABC-MFG-27AABCA',
    secondaryIdentifier: 'ACC-2026-9041',
    qrPurpose: 'identification',
    customFields: {
      'Account Type': 'Enterprise Fleet Partner',
      'Registered Address': 'Plot 12, GIDC Industrial Estate, Ahmedabad, Gujarat',
      'Dedicated Account Manager': 'Amit Sharma (VP Enterprise Accounts)',
      'Active Connected Machines': '42 Units',
      'Support Tier': '24/7 Dedicated SLA'
    },
    relationships: [
      { id: 'r10', sourceEntityId: 'UQR-CUST-000001', targetEntityId: 'UQR-PROD-000001', targetEntityName: 'AGB HydroMax 500', targetEntityType: 'product', relationType: 'OWNS' }
    ],
    status: 'Active',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    tags: ['Customer', 'Enterprise', 'Client', 'Tier1'],
    location: 'Ahmedabad Industrial Zone',
    supplier: 'ABC Heavy Industries',
    connectedApps: ['Enterprise ERP', 'Customer Portal']
  },
  {
    id: 'ent-eqp-006',
    uniqrCode: 'UQR-EQP-000006',
    name: 'Digital Torque Calibrator & Micrometer Kit',
    sku: 'EQP-TOOL-402',
    brand: 'Mitutoyo / AGB Metrology',
    manufacturer: 'Mitutoyo Precision Ltd',
    description: 'NIST-traceable precision torque wrench calibrator with digital readout for QA auditing and tool room inspection.',
    category: 'Tooling & Equipment',
    hsn: '90318000',
    gst: 18,
    batchNumber: 'TOOL-QA-402',
    serialNumber: 'CAL-2026-904',
    mfgDate: '2025-06-01',
    expDate: '2030-06-01',
    warrantyMonths: 36,
    entityType: 'equipment',
    identityNumber: 'EQP-TOOL-402',
    secondaryIdentifier: 'CAL-2026-904',
    qrPurpose: 'maintenance',
    customFields: {
      'Torque Range': '5 - 250 Nm',
      'Accuracy Rating': '±0.05% Full Scale',
      'Assigned Custodian': 'Quality Assurance Directorate',
      'Next Calibration Due': '2026-12-01',
      'Storage Location': 'Tool Crib Bin B-42'
    },
    relationships: [
      { id: 'r11', sourceEntityId: 'UQR-EQP-000006', targetEntityId: 'UQR-LOC-000011', targetEntityName: 'Pune Central Hub', targetEntityType: 'location', relationType: 'LOCATED_AT' }
    ],
    status: 'Active',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2026-06-01T11:00:00Z',
    tags: ['Equipment', 'Tooling', 'Calibration', 'QA'],
    location: 'Tool Crib Bin B-42',
    supplier: 'Mitutoyo Precision',
    connectedApps: ['Calibration Registry', 'Tooling Tracker']
  }
];

export const INITIAL_QR_RECORDS: QrCodeRecord[] = [
  {
    id: 'qr-1',
    productId: 'prod-uqr-001',
    uniqrCode: 'UQR-PROD-000001',
    config: {
      fgColor: '#1D4533',
      bgColor: '#F7EAE0',
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      errorCorrectionLevel: 'H'
    },
    generatedAt: '2026-07-12T10:00:00Z',
    totalScans: 284,
    totalDownloads: 42,
    lastScannedAt: '2026-08-14T11:42:00Z',
    status: 'Active'
  },
  {
    id: 'qr-2',
    productId: 'prod-1',
    uniqrCode: 'UQ-8AF92B7A2',
    config: {
      fgColor: '#1D4533',
      bgColor: '#F7EAE0',
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      errorCorrectionLevel: 'H'
    },
    generatedAt: '2026-07-01T10:00:00Z',
    totalScans: 142,
    totalDownloads: 19,
    lastScannedAt: '2026-08-02T11:42:00Z',
    status: 'Active'
  },
  {
    id: 'qr-3',
    productId: 'ent-doc-013',
    uniqrCode: 'UQR-DOC-000013',
    config: {
      fgColor: '#1D4533',
      bgColor: '#F7EAE0',
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      errorCorrectionLevel: 'H'
    },
    generatedAt: '2026-01-01T08:00:00Z',
    totalScans: 95,
    totalDownloads: 14,
    lastScannedAt: '2026-08-12T16:20:00Z',
    status: 'Active'
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  { id: 'company-agb', label: 'AGB Technologies Ltd', type: 'Company', details: { Reg: 'IND-KA-2024-AGB', Location: 'Bengaluru, India' } },
  { id: 'prod-uqr-001', label: 'AGB HydroMax 500', type: 'Product', details: { SKU: 'HM500-IND', Price: '₹85,000' } },
  { id: 'ent-mach-003', label: '5-Axis CNC Center V500', type: 'Product', details: { SKU: 'MACH-CNC-V500', Power: '45 kW' } },
  { id: 'ent-loc-011', label: 'Pune Logistics Bay 4', type: 'Warehouse', details: { Zone: 'MIDC Phase II', Capacity: '850 Pallets' } },
  { id: 'ent-cust-001', label: 'ABC Heavy Industries', type: 'Customer', details: { City: 'Ahmedabad', Tier: 'Enterprise Partner' } },
  { id: 'ent-bat-009', label: 'Batch Lot 2026-08', type: 'Batch', details: { LotSize: '1,000 Units', Heat: 'HT-8820' } },
  { id: 'app-uniqr', label: 'UniQR Platform', type: 'App', details: { Domain: 'uniqr.agbtechnologies.in' } },
  { id: 'app-erp', label: 'Enterprise ERP', type: 'App', details: { Modules: 'Invoicing & Inventory' } },
];

export const INITIAL_GRAPH_LINKS: GraphLink[] = [
  { source: 'company-agb', target: 'prod-uqr-001', relation: 'CREATED' },
  { source: 'company-agb', target: 'ent-mach-003', relation: 'CREATED' },
  { source: 'prod-uqr-001', target: 'ent-loc-011', relation: 'STORED_IN' },
  { source: 'ent-mach-003', target: 'ent-loc-011', relation: 'STORED_IN' },
  { source: 'prod-uqr-001', target: 'ent-bat-009', relation: 'PART_OF_BATCH' },
  { source: 'ent-cust-001', target: 'prod-uqr-001', relation: 'OWNS' },
  { source: 'prod-uqr-001', target: 'app-uniqr', relation: 'CONNECTED_TO' },
  { source: 'prod-uqr-001', target: 'app-erp', relation: 'CONNECTED_TO' },
];

export const INITIAL_SCANS: ScanEvent[] = [
  { id: 'scan-1', uniqrCode: 'UQR-PROD-000001', productName: 'AGB HydroMax 500 Industrial Water Pump', timestamp: '2026-08-14T11:42:00Z', country: 'India', city: 'Pune', device: 'Mobile', os: 'Android 15', browser: 'Chrome Mobile', referral: 'Direct Scan', appSource: 'UniQR App', isRepeat: true },
  { id: 'scan-2', uniqrCode: 'UQR-DOC-000013', productName: 'ISO 9001:2015 Quality & Safety SOP Manual', timestamp: '2026-08-12T16:20:00Z', country: 'India', city: 'Mumbai', device: 'Desktop', os: 'Windows 11', browser: 'Chrome', referral: 'QR Camera Scan', appSource: 'Web Browser', isRepeat: false },
  { id: 'scan-3', uniqrCode: 'UQR-MACH-000003', productName: '5-Axis Industrial CNC Machining Center V500', timestamp: '2026-08-10T09:15:00Z', country: 'India', city: 'Pune', device: 'Mobile', os: 'iOS 19.1', browser: 'Safari', referral: 'Field Maintenance App', appSource: 'UniQR App', isRepeat: true },
  { id: 'scan-4', uniqrCode: 'UQ-8AF92B7A2', productName: 'AERO-X Pro Fitness Dumbbell (20kg)', timestamp: '2026-08-02T11:42:00Z', country: 'India', city: 'Bengaluru', device: 'Mobile', os: 'Android 15', browser: 'Chrome Mobile', referral: 'Direct Scan', appSource: 'UniQR App', isRepeat: true }
];

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Starter Free',
    priceINR: 0,
    basePriceINR: 0,
    gstPercent: 18,
    gstAmountINR: 0,
    totalAmountINR: 0,
    qrLimitDaily: 10,
    lifetimeCap: 10,
    features: [
      'Lifetime Free',
      'Up to 10 Active Product QRs',
      'Standard PNG & SVG Exports',
      'Basic Product Identity Passport'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Growth',
    priceINR: 399,
    basePriceINR: 399,
    gstPercent: 18,
    gstAmountINR: 71.82,
    totalAmountINR: 470.82,
    qrLimitDaily: 50,
    features: [
      'Everything that comes with free',
      'Up to 50 Product QRs / Mo',
      '8192px Ultra High Res Exports',
      'Tamper-Evident Trail Ledgers'
    ]
  },
  {
    id: 'business',
    name: 'Business Scale',
    priceINR: 999,
    basePriceINR: 999,
    gstPercent: 18,
    gstAmountINR: 179.82,
    totalAmountINR: 1178.82,
    qrLimitDaily: 500,
    isPopular: true,
    features: [
      'Up to 500 Product QRs / Mo',
      'Laser / Vector Engraving SVG',
      'AI Decision Engine & ML'
    ]
  },
  {
    id: 'factory',
    name: 'Factory Scale',
    priceINR: 2999,
    basePriceINR: 2999,
    gstPercent: 18,
    gstAmountINR: 539.82,
    totalAmountINR: 3538.82,
    qrLimitDaily: 5000,
    features: [
      'Up to 5,000 Product QRs / Mo',
      'Laser / Vector Engraving SVG',
      'AI Decision Engine & ML'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    priceINR: 9999,
    basePriceINR: 9999,
    gstPercent: 18,
    gstAmountINR: 1799.82,
    totalAmountINR: 11798.82,
    qrLimitDaily: 99999,
    features: [
      'Unlimited Product Identifiers',
      'Dedicated Enterprise ERP Sync',
      'Custom Domain & SLA Guarantee'
    ]
  }
];

export const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: 'key-1',
    name: 'UniQR Production Pipeline',
    keySecret: 'uq_live_8f912a77b62901c04948a21',
    createdAt: '2026-07-05T14:00:00Z',
    lastUsedAt: '2026-08-14T11:40:00Z',
    status: 'Active'
  },
  {
    id: 'key-2',
    name: 'Enterprise ERP Automated Sync',
    keySecret: 'uq_live_3309a12c88410d992e10a88',
    createdAt: '2026-07-15T09:30:00Z',
    lastUsedAt: '2026-08-12T16:12:00Z',
    status: 'Active'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-14T11:42:00Z', action: 'QR Scanned', user: 'Public Guest', ip: '103.14.24.12', details: 'Scanned UQR-PROD-000001 (AGB HydroMax 500) from Pune, IN' },
  { id: 'log-2', timestamp: '2026-08-12T16:20:00Z', action: 'Document Verified', user: 'auditor@tuv-rheinland.com', ip: '49.207.19.88', details: 'Cryptographically verified UQR-DOC-000013 ISO 9001 SOP' },
  { id: 'log-3', timestamp: '2026-08-10T09:15:00Z', action: 'Machine Health Telemetry', user: 'system@siemens.in', ip: '122.160.10.4', details: 'Logged vibration telemetry for UQR-MACH-000003' }
];
