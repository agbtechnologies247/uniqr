import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db.json');

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

const seedProducts = [
  {
    id: 'prod-1',
    uniqrCode: 'UQ-8AF92B7A2',
    name: 'AERO-X Pro Fitness Dumbbell (20kg)',
    sku: 'AGB-FT-DB20',
    brand: 'GymKeys Hardware',
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
    customFields: {
      'Weight Tolerance': '±10 grams',
      'Coating': 'Polyurethane Vulcanized',
      'Ecosystem Target': 'GymKeys Commercial'
    },
    builderSections: [
      {
        id: 'sec-info',
        title: 'Product Information',
        category: 'Details',
        isSystemProtected: true,
        fields: [
          { id: 'f-name', name: 'Product Name', type: 'Text', value: 'AERO-X Pro Fitness Dumbbell (20kg)', validation: { required: true, isPublic: true } },
          { id: 'f-sku', name: 'SKU Code', type: 'Barcode', value: 'AGB-FT-DB20', validation: { required: true, isPublic: true } }
        ]
      }
    ],
    trailEvents: [
      {
        id: 'evt-101',
        qrId: 'UQ-8AF92B7A2',
        type: 'Manufactured',
        module: 'Manufacturing',
        timestamp: '2026-06-15T08:30:00Z',
        location: 'Pune Plant Line 1',
        user: 'system.mfg@agb.in',
        erpTask: 'ERP-MFG-8810',
        digitalSignature: 'SIG-8F12A09B',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      {
        id: 'evt-102',
        qrId: 'UQ-8AF92B7A2',
        type: 'Quality Check Passed',
        module: 'Quality',
        timestamp: '2026-06-15T14:15:00Z',
        location: 'Pune Quality Testing Lab',
        user: 'r.sharma@agb.in',
        erpTask: 'ERP-QC-2094',
        digitalSignature: 'SIG-3C910FA1',
        previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        currentHash: '6dcd4ce23d88e2ee95680a61464789d6e409ecb71a2d59648939c09538a7c293'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80',
    tags: ['Fitness', 'GymKeys', 'Commercial'],
    location: 'Warehouse A-12, Bengaluru',
    supplier: 'Metallix Industries',
    status: 'Active',
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-15T14:30:00Z',
    connectedApps: ['GymKeys', 'BillSoft', 'Warranty', 'CRM']
  },
  {
    id: 'prod-med-01',
    uniqrCode: 'UQ-MED-9941',
    name: 'BioPulse ISO 13485 Cardiac Defibrillator',
    sku: 'AGB-MED-DEF1',
    brand: 'AGB MedTech',
    manufacturer: 'AGB BioMedical Systems',
    description: 'Hospital grade emergency defibrillator with real-time cloud telemetry and sterilised compliance log.',
    category: 'Medical Device',
    hsn: '90189099',
    gst: 12,
    batchNumber: 'STERIL-2026-X99',
    serialNumber: 'MED-DEF-9021',
    mfgDate: '2026-05-01',
    expDate: '2031-05-01',
    warrantyMonths: 60,
    customFields: {
      'Sterilization': 'Autoclave 134°C Passed',
      'ISO Compliance': 'ISO 13485:2016 Certified',
      'Bio-Engineer': 'Dr. A. Kulkarni'
    },
    trailEvents: [
      {
        id: 'evt-m1',
        qrId: 'UQ-MED-9941',
        type: 'ISO 13485 Assembly Completed',
        module: 'Manufacturing',
        timestamp: '2026-05-01T09:00:00Z',
        location: 'Cleanroom Facility Unit 4',
        user: 'med.operator@agb.in',
        erpTask: 'ERP-ISO-1002',
        digitalSignature: 'SIG-MED-101',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      },
      {
        id: 'evt-m2',
        qrId: 'UQ-MED-9941',
        type: 'Autoclave Sterilization Certified',
        module: 'Quality',
        timestamp: '2026-05-02T11:00:00Z',
        location: 'Sterilization Chamber B',
        user: 'dr.kulkarni@agb.in',
        erpTask: 'ERP-STERIL-9940',
        digitalSignature: 'SIG-STERIL-902',
        previousHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        currentHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
    tags: ['Medical', 'ISO13485', 'Hospital', 'Sterile'],
    location: 'MedDepot Clean Vault #2',
    supplier: 'BioPharma Precision',
    status: 'Active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    connectedApps: ['Hospital EMR', 'BillSoft', 'Compliance Engine']
  },
  {
    id: 'prod-veh-01',
    uniqrCode: 'UQ-VEH-8821',
    name: 'VoltX Electric Fleet Delivery Van',
    sku: 'AGB-EV-VAN01',
    brand: 'AGB Mobility',
    manufacturer: 'AGB Automotive Ltd',
    description: 'Commercial electric logistics vehicle with 17-character VIN digital twin and battery BMS telematics.',
    category: 'Automotive & Fleet',
    hsn: '87038010',
    gst: 5,
    batchNumber: 'FLEET-2026-V1',
    serialNumber: 'VIN-MA3EWB1S0009923',
    mfgDate: '2026-04-10',
    expDate: '2041-04-10',
    warrantyMonths: 96,
    customFields: {
      'VIN': 'MA3EWB1S0009923',
      'Battery Capacity': '75 kWh Lithium Iron Phosphate',
      'Odometer': '14,200 km'
    },
    trailEvents: [
      {
        id: 'evt-v1',
        qrId: 'UQ-VEH-8821',
        type: 'Vehicle VIN Registered',
        module: 'Manufacturing',
        timestamp: '2026-04-10T14:00:00Z',
        location: 'Auto Assembly Gigafactory',
        user: 'vin.registrar@agb.in',
        erpTask: 'ERP-AUTO-9912',
        digitalSignature: 'SIG-AUTO-881',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: '4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80',
    tags: ['EV', 'Automotive', 'Fleet', 'VIN'],
    location: 'Bengaluru Logistics Yard',
    supplier: 'AGB Gigafactory',
    status: 'Active',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    connectedApps: ['Fleet Telematics', 'BillSoft', 'GPS Radar']
  },
  {
    id: 'prod-2',
    uniqrCode: 'UQ-93F10A4B1',
    name: 'Smart IoT Energy Gateway V4',
    sku: 'AGB-IOT-GW4',
    brand: 'AGB Industrial',
    manufacturer: 'AGB Technologies Ltd',
    description: 'High performance edge IoT telemetry device with Neo4j graph connector and encrypted serial authentication.',
    category: 'Electronics',
    hsn: '85176290',
    gst: 18,
    batchNumber: 'BATCH-2026-07B',
    serialNumber: 'GW4-8831-X7',
    mfgDate: '2026-05-10',
    expDate: '2031-05-10',
    warrantyMonths: 24,
    customFields: {
      'Firmware': 'v4.2.1-agb',
      'Processor': 'ARM Cortex-M7',
      'Voltage': '12-24V DC'
    },
    trailEvents: [
      {
        id: 'evt-201',
        qrId: 'UQ-93F10A4B1',
        type: 'Manufactured & Flashed',
        module: 'Manufacturing',
        timestamp: '2026-05-10T10:00:00Z',
        location: 'Electronics SMT Plant #2',
        user: 'smt.operator@agb.in',
        erpTask: 'ERP-SMT-5512',
        digitalSignature: 'SIG-4F910B88',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: 'b4b147bc522828731f1a016bfa72c073da8a81648a19280d0d826a4a0349b1e8'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    tags: ['IoT', 'Gateway', 'Electronics'],
    location: 'Electronics Depot B-04',
    supplier: 'AGB Embedded Labs',
    status: 'Active',
    createdAt: '2026-07-10T08:15:00Z',
    updatedAt: '2026-07-20T11:00:00Z',
    connectedApps: ['PRICE', 'BillSoft', 'Inventory']
  }
];

const seedData = {
  products: seedProducts,
  qrRecords: seedProducts.map(p => ({
    id: 'qr-' + p.id,
    uniqrCode: p.uniqrCode,
    productId: p.id,
    productName: p.name,
    publicUrl: `https://uniqr.agbtechnologies.in/q/${p.uniqrCode}`,
    createdAt: p.createdAt,
    totalScans: Math.floor(Math.random() * 500 + 50),
    totalDownloads: Math.floor(Math.random() * 50 + 10),
    status: 'Active'
  })),
  graphNodes: [
    { id: 'company-agb', label: 'AGB Technologies Ltd', type: 'Company' },
    ...seedProducts.map(p => ({ id: p.id, label: p.name, type: 'Product' }))
  ],
  graphLinks: seedProducts.map(p => ({
    source: 'company-agb',
    target: p.id,
    relation: 'CREATED'
  })),
  scans: []
};

fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2));
console.log('✅ Successfully seeded backend database db.json with 4 industrial scenarios!');
