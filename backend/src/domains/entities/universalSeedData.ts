export interface UniversalQRObject {
  qr_id: string;
  type: 
    | 'product' 
    | 'customer' 
    | 'asset' 
    | 'work_order' 
    | 'process' 
    | 'process_step'
    | 'verification' 
    | 'warranty' 
    | 'guide' 
    | 'terms_conditions' 
    | 'location' 
    | 'employee' 
    | 'document' 
    | 'certificate'
    | 'organization'
    | 'vendor';
  status: 'active' | 'completed' | 'in_progress' | 'archived';
  versioning: {
    enabled: boolean;
    current_version?: number;
    reason?: string;
  };
  identity: Record<string, any>;
  attributes?: Record<string, any>;
  commercial?: Record<string, any>;
  contact?: Record<string, any>;
  location?: Record<string, any>;
  installation?: Record<string, any>;
  assignment?: Record<string, any>;
  schedule?: Record<string, any>;
  coverage?: Record<string, any>;
  translations?: Record<string, any>;
  checks?: Array<{ name: string; result: string }>;
  steps?: Array<any>;
  sections?: Array<{ title: string; content: string }>;
  relationships: string[]; // Array of related UQR IDs
  createdAt: string;
  updatedAt: string;
}

export const DEMO_COMPANY_NAME = "AGB Industrial Equipment Pvt. Ltd.";

export const UNIVERSAL_SEED_DATA: UniversalQRObject[] = [
  // 1. PRODUCT 1: AGB HydroMax 500
  {
    qr_id: "UQR-PROD-000001",
    type: "product",
    status: "active",
    versioning: { enabled: true, current_version: 3, reason: "scan_analytics" },
    identity: {
      name: "AGB HydroMax 500",
      category: "Industrial Water Pump",
      brand: "AGB Industrial",
      model: "HM-500",
      sku: "HM500-IND",
      serial_number: "HM500-2026-000847"
    },
    attributes: {
      power: "5 HP",
      voltage: "415V",
      capacity: "500 LPM",
      material: "Stainless Steel 316",
      operating_pressure: "10 bar"
    },
    commercial: {
      manufacturing_date: "2026-07-12",
      purchase_date: "2026-08-01",
      invoice_number: "INV-2026-00891"
    },
    relationships: [
      "UQR-CUST-000001",
      "UQR-ASSET-000001",
      "UQR-WAR-000001",
      "UQR-GDE-000001",
      "UQR-GDE-000002",
      "UQR-TNC-000001",
      "UQR-LOC-000001"
    ],
    createdAt: "2026-07-12T10:00:00Z",
    updatedAt: "2026-08-13T12:00:00Z"
  },

  // 2. PRODUCT 2: AGB High Pressure Pump
  {
    qr_id: "UQR-PROD-000002",
    type: "product",
    status: "active",
    versioning: { enabled: true, current_version: 1, reason: "scan_analytics" },
    identity: {
      name: "AGB TurboJet 1000",
      category: "High Pressure Pump",
      brand: "AGB Industrial",
      model: "TJ-1000",
      sku: "TJ1000-HEAVY",
      serial_number: "TJ1000-2026-001049"
    },
    attributes: {
      power: "15 HP",
      voltage: "415V 3-Phase",
      capacity: "1200 LPM",
      operating_pressure: "25 bar"
    },
    commercial: {
      manufacturing_date: "2026-08-01",
      purchase_date: "2026-08-10",
      invoice_number: "INV-2026-00940"
    },
    relationships: ["UQR-CUST-000001", "UQR-GDE-000001", "UQR-TNC-000001"],
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-08-10T14:00:00Z"
  },

  // 3. CUSTOMER: ABC Manufacturing Pvt. Ltd.
  {
    qr_id: "UQR-CUST-000001",
    type: "customer",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "ABC Manufacturing Pvt. Ltd.",
      customer_code: "CUS-00981",
      industry: "Heavy Machinery & Fabrication"
    },
    contact: {
      email: "purchase@abcmanufacturing.example",
      phone: "+91-9049874780",
      contact_person: "Vikram Mehta (VP Supply Chain)"
    },
    location: {
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      address: "Plot 42, Chakan Industrial Area Phase 2, Pune 410501"
    },
    relationships: [
      "UQR-ASSET-000001",
      "UQR-PROD-000001",
      "UQR-WO-000001",
      "UQR-WO-000002"
    ],
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-08-03T10:00:00Z"
  },

  // 4. INSTALLED ASSET: HydroMax Pump - ABC Plant
  {
    qr_id: "UQR-ASSET-000001",
    type: "asset",
    status: "active",
    versioning: { enabled: true, current_version: 2, reason: "maintenance_tracking" },
    identity: {
      asset_number: "AST-PUN-00481",
      name: "HydroMax Pump - ABC Pune Plant Utility Line"
    },
    installation: {
      date: "2026-08-03",
      location: "ABC Manufacturing Pune Plant",
      floor: "Ground Floor",
      area: "Utility Section Bay 4",
      gps_coordinates: "18.5204° N, 73.8567° E"
    },
    relationships: [
      "UQR-PROD-000001",
      "UQR-CUST-000001",
      "UQR-WO-000001",
      "UQR-WO-000002",
      "UQR-VER-000001"
    ],
    createdAt: "2026-08-03T11:00:00Z",
    updatedAt: "2026-08-03T14:30:00Z"
  },

  // 5. WORK ORDER 1: Installation Work Order
  {
    qr_id: "UQR-WO-000001",
    type: "work_order",
    status: "completed",
    versioning: { enabled: false },
    identity: {
      work_order_number: "WO-2026-00481",
      title: "HydroMax 500 Installation & Commissioning"
    },
    assignment: {
      customer: "UQR-CUST-000001",
      asset: "UQR-ASSET-000001",
      engineer: "UQR-EMP-000001"
    },
    schedule: {
      planned_date: "2026-08-03",
      start_time: "10:00",
      end_time: "14:30"
    },
    relationships: [
      "UQR-PROC-000001",
      "UQR-VER-000001",
      "UQR-EMP-000001"
    ],
    createdAt: "2026-08-02T16:00:00Z",
    updatedAt: "2026-08-03T14:30:00Z"
  },

  // 6. WORK ORDER 2: Annual Maintenance Work Order
  {
    qr_id: "UQR-WO-000002",
    type: "work_order",
    status: "active",
    versioning: { enabled: false },
    identity: {
      work_order_number: "WO-2026-00912",
      title: "Scheduled Annual Preventive Maintenance"
    },
    assignment: {
      customer: "UQR-CUST-000001",
      asset: "UQR-ASSET-000001",
      engineer: "UQR-EMP-000001"
    },
    schedule: {
      planned_date: "2027-08-03",
      start_time: "09:00",
      end_time: "12:00"
    },
    relationships: ["UQR-ASSET-000001", "UQR-EMP-000001"],
    createdAt: "2026-08-03T15:00:00Z",
    updatedAt: "2026-08-03T15:00:00Z"
  },

  // 7. VERIFICATION: Installation Quality Check
  {
    qr_id: "UQR-VER-000001",
    type: "verification",
    status: "completed",
    versioning: { enabled: false },
    identity: {
      verification_type: "Installation & Pressure Test Verification",
      verification_number: "VER-2026-00198"
    },
    checks: [
      { name: "Serial Number & HSN Match", result: "PASS" },
      { name: "Electrical 415V Wiring Connection", result: "PASS" },
      { name: "Hydraulic Pressure Test (10 bar)", result: "PASS" },
      { name: "Zero Leakage & Vibration Audit", result: "PASS" }
    ],
    relationships: ["UQR-ASSET-000001", "UQR-EMP-000001", "UQR-WO-000001"],
    createdAt: "2026-08-03T14:21:00Z",
    updatedAt: "2026-08-03T14:21:00Z"
  },

  // 8. WARRANTY: 24-Month Product Warranty
  {
    qr_id: "UQR-WAR-000001",
    type: "warranty",
    status: "active",
    versioning: { enabled: false },
    identity: {
      warranty_number: "WAR-2026-00891",
      type: "Standard Industrial 24-Month Warranty"
    },
    coverage: {
      duration: "24 months",
      start_date: "2026-08-01",
      end_date: "2028-07-31",
      terms: "Covers mechanical motor failure, impeller defects, and shaft seals."
    },
    relationships: ["UQR-PROD-000001", "UQR-ASSET-000001", "UQR-TNC-000001"],
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z"
  },

  // 9. MULTILINGUAL GUIDE: Installation Manual
  {
    qr_id: "UQR-GDE-000001",
    type: "guide",
    status: "active",
    versioning: { enabled: true, current_version: 2 },
    identity: {
      name: "AGB HydroMax 500 Installation & Operator Guide"
    },
    translations: {
      "en-IN": {
        title: "Installation & Maintenance Guide",
        content: "Connect the pump according to the 415V 3-phase wiring diagram. Ensure baseplate levelling prior to anchor bolt tightening."
      },
      "hi-IN": {
        title: "स्थापना एवं रखरखाव मार्गदर्शिका",
        content: "वायरिंग आरेख के अनुसार 415V 3-फ़ेज़ पंप को कनेक्ट करें। एंकर बोल्ट कसने से पहले बेसप्लेट समतलन सुनिश्चित करें।"
      },
      "mr-IN": {
        title: "स्थापना व देखभाल मार्गदर्शक",
        content: "वायरिंग आकृतीनुसार ४१५V ३-फेस पंप कनेक्ट करा. अँकर बोल्ट घट्ट करण्यापूर्वी बेसप्लेट समतलीकरण तपासा."
      }
    },
    relationships: ["UQR-PROD-000001", "UQR-PROC-000001"],
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z"
  },

  // 10. GUIDE 2: Safety & Operator Guide
  {
    qr_id: "UQR-GDE-000002",
    type: "guide",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "Industrial Pump High Voltage & Pressure Safety Guide"
    },
    translations: {
      "en-IN": {
        title: "Safety & PPE Requirements",
        content: "Always isolate main power breaker before servicing. Wear safety goggles and steel-toe boots."
      }
    },
    relationships: ["UQR-PROD-000001"],
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z"
  },

  // 11. GUIDE 3: Troubleshooting Guide
  {
    qr_id: "UQR-GDE-000003",
    type: "guide",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "Pump Pressure Loss & Cavitation Troubleshooting Guide"
    },
    relationships: ["UQR-PROD-000001"],
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z"
  },

  // 12. TERMS & CONDITIONS: Warranty Terms
  {
    qr_id: "UQR-TNC-000001",
    type: "terms_conditions",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "AGB Industrial HydroMax Warranty Terms & Legal Disclaimers"
    },
    sections: [
      { title: "Warranty Coverage", content: "Covers material defects for 24 months from invoice date." },
      { title: "Exclusions", content: "Damage from dry running or unauthorized electrical modifications voids warranty." },
      { title: "Claim Process", content: "Scan asset QR code and submit service ticket via UniQR portal." }
    ],
    relationships: ["UQR-PROD-000001", "UQR-WAR-000001"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },

  // 13. LOCATION: Pune Central Warehouse
  {
    qr_id: "UQR-LOC-000001",
    type: "location",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "AGB Pune Central Logistics Warehouse",
      location_code: "LOC-PUN-01"
    },
    location: {
      city: "Pune",
      state: "Maharashtra",
      gps: "18.6298° N, 73.7997° E"
    },
    relationships: ["UQR-PROD-000001", "UQR-EMP-000001"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },

  // 14. EMPLOYEE: Service Engineer
  {
    qr_id: "UQR-EMP-000001",
    type: "employee",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "Rajesh Sharma",
      employee_id: "EMP-AGB-0941",
      role: "Senior Service Engineer"
    },
    contact: {
      email: "r.sharma@agb.in",
      phone: "+91-9823456789"
    },
    relationships: ["UQR-WO-000001", "UQR-VER-000001", "UQR-LOC-000001"],
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2026-08-03T00:00:00Z"
  },

  // 15. PROCESS: Industrial Pump Installation Process
  {
    qr_id: "UQR-PROC-000001",
    type: "process",
    status: "active",
    versioning: { enabled: true, current_version: 1 },
    identity: {
      name: "Industrial Pump Commissioning Process",
      process_code: "PROC-INSTALL-PUMP"
    },
    steps: [
      { qr_id: "UQR-STEP-000001", sequence: 1, name: "Verify Product Serial Number & HSN", required: true },
      { qr_id: "UQR-STEP-000002", sequence: 2, name: "Inspect Foundation & Electrical Line", required: true },
      { qr_id: "UQR-STEP-000003", sequence: 3, name: "Mount & Anchor Pump Unit", required: true },
      { qr_id: "UQR-STEP-000004", sequence: 4, name: "Execute 10-Bar Pressure Test", required: true }
    ],
    relationships: ["UQR-WO-000001", "UQR-GDE-000001"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },

  // 16. PROCESS STEP: Step 1
  {
    qr_id: "UQR-STEP-000001",
    type: "process_step",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "Step 1: Verify Serial Number & HSN Match",
      step_code: "STEP-PUMP-01"
    },
    relationships: ["UQR-PROC-000001", "UQR-PROD-000001"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },

  // 17. DOCUMENT: Certificate of Conformance
  {
    qr_id: "UQR-DOC-000001",
    type: "document",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "HydroMax 500 Test Bench & Certificate of Conformance",
      doc_number: "DOC-2026-88192"
    },
    relationships: ["UQR-PROD-000001", "UQR-CERT-000001"],
    createdAt: "2026-07-12T10:00:00Z",
    updatedAt: "2026-07-12T10:00:00Z"
  },

  // 18. CERTIFICATE: ISO-9001 Quality Certificate
  {
    qr_id: "UQR-CERT-000001",
    type: "certificate",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "ISO 9001:2025 Manufacturing Quality Certificate",
      cert_number: "CERT-ISO-9001-2025"
    },
    relationships: ["UQR-ORG-000001", "UQR-PROD-000001"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },

  // 19. ORGANIZATION: AGB Industrial Equipment
  {
    qr_id: "UQR-ORG-000001",
    type: "organization",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "AGB Industrial Equipment Pvt. Ltd.",
      gstin: "27AAACA9948F1Z2",
      cin: "U29100MH2020PTC345678"
    },
    relationships: ["UQR-PROD-000001", "UQR-LOC-000001", "UQR-CERT-000001"],
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  },

  // 20. VENDOR: Motor Supplier
  {
    qr_id: "UQR-VEND-000001",
    type: "vendor",
    status: "active",
    versioning: { enabled: false },
    identity: {
      name: "Kirloskar Electric & Motors Ltd.",
      vendor_code: "VEND-KIRL-001"
    },
    relationships: ["UQR-PROD-000001", "UQR-ORG-000001"],
    createdAt: "2021-05-10T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  }
];
