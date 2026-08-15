import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middleware/logger.js';

import { UNIVERSAL_SEED_DATA, DEMO_COMPANY_NAME } from './domains/entities/universalSeedData.js';
import { authRouter } from './routes/auth.routes.js';
import { createProductRouter } from './routes/product.routes.js';
import { createTrailRouter } from './routes/trail.routes.js';
import { billingRouter } from './routes/billing.routes.js';
import { createAnalyticsRouter } from './routes/analytics.routes.js';
import { createResolveRouter } from './routes/resolve.routes.js';
import { createDeveloperRouter } from './routes/developer.routes.js';
import { createPassportRouter } from './routes/passport.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware (Helmet)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for flexible cross-origin assets in dev/demo
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: ['https://uniqr.agbtechnologies.in', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(requestLogger);

const DATA_FILE = path.join(__dirname, 'db.json');

export interface Product {
  id: string;
  uniqrCode: string;
  name: string;
  sku: string;
  brand: string;
  manufacturer: string;
  description: string;
  category: string;
  hsn: string;
  gst: number;
  batchNumber: string;
  serialNumber: string;
  mfgDate: string;
  expDate: string;
  warrantyMonths: number;
  customFields?: Record<string, string>;
  builderSections?: any[];
  trailEvents?: any[];
  imageUrl?: string;
  tags?: string[];
  location?: string;
  supplier?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  connectedApps?: string[];
  entityType?: string;
  entityCode?: string;
  identityNumber?: string;
  organization?: string;
  relationships?: any[];
}

export interface Database {
  products: Product[];
  qrRecords: any[];
  graphNodes: any[];
  graphLinks: any[];
  scans: any[];
  apiKeys?: any[];
}

function loadDatabase(): Database {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      // Fallback
    }
  }
  return {
    products: [],
    qrRecords: [],
    graphNodes: [],
    graphLinks: [],
    scans: [],
    apiKeys: []
  };
}

function saveDatabase(database: Database) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(database, null, 2));
}

let db = loadDatabase();

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// ---- Seed-to-Product Converter (runs once on startup) ----

function convertSeedToProduct(seed: typeof UNIVERSAL_SEED_DATA[number]): Product {
  const customFields: Record<string, string> = {};

  const flatten = (obj: Record<string, any> | undefined, prefix?: string) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined || v === '') continue;
      const label = (prefix ? `${prefix} — ` : '') + k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      customFields[label] = typeof v === 'object' ? JSON.stringify(v) : String(v);
    }
  };

  flatten(seed.identity);
  flatten(seed.attributes);
  flatten(seed.commercial);
  flatten(seed.contact);
  flatten(seed.location);
  flatten(seed.installation);
  flatten(seed.assignment);
  flatten(seed.schedule);
  flatten(seed.coverage);
  flatten(seed.translations);

  customFields['Entity Type'] = seed.type;
  customFields['Status'] = seed.status;
  if (seed.versioning?.enabled) {
    customFields['Version'] = String(seed.versioning.current_version || 1);
  }

  if (seed.checks) {
    seed.checks.forEach((c, i) => { customFields[`Check ${i + 1} — ${c.name}`] = c.result; });
  }
  if (seed.steps) {
    seed.steps.forEach((s: any, i: number) => {
      customFields[s.name || `Step ${i + 1}`] = s.required ? 'Required' : 'Optional';
    });
  }
  if (seed.sections) {
    seed.sections.forEach(s => { customFields[s.title] = s.content; });
  }
  if (seed.relationships.length > 0) {
    customFields['Related Entities'] = seed.relationships.join(', ');
  }

  const entityName = seed.identity?.name || seed.identity?.title || seed.qr_id;
  const entityCategory = seed.identity?.category || seed.identity?.industry ||
    seed.type.charAt(0).toUpperCase() + seed.type.slice(1).replace(/_/g, ' ');
  const mfgDate = seed.commercial?.manufacturing_date || seed.createdAt?.split('T')[0] || '';

  return {
    id: seed.qr_id,
    uniqrCode: seed.qr_id,
    name: entityName,
    sku: seed.identity?.sku || seed.identity?.asset_number || seed.identity?.customer_code ||
         seed.identity?.work_order_number || seed.identity?.doc_number || seed.identity?.cert_number ||
         seed.identity?.employee_id || seed.identity?.vendor_code || seed.identity?.location_code ||
         seed.identity?.process_code || seed.identity?.step_code || seed.identity?.verification_number ||
         seed.identity?.warranty_number || seed.qr_id,
    brand: seed.identity?.brand || DEMO_COMPANY_NAME,
    manufacturer: seed.identity?.manufacturer || DEMO_COMPANY_NAME,
    description: `${entityCategory} Identity Passport — ${entityName}`,
    category: entityCategory,
    hsn: seed.identity?.hsn || '',
    gst: seed.identity?.gst || 0,
    batchNumber: seed.commercial?.invoice_number || '',
    serialNumber: seed.identity?.serial_number || seed.identity?.asset_number || seed.qr_id,
    mfgDate,
    expDate: seed.coverage?.end_date || '',
    warrantyMonths: seed.coverage?.duration_months || 0,
    customFields,
    trailEvents: [
      {
        id: `evt-seed-${seed.qr_id}`,
        qrId: seed.qr_id,
        type: 'Registered in UniQR',
        module: 'Manufacturing',
        timestamp: seed.createdAt || new Date().toISOString(),
        location: seed.installation?.location || seed.location?.address || seed.location?.city || 'Pune',
        department: 'System',
        user: 'bhramitp@gmail.com',
        erpTask: '',
        digitalSignature: `SIG-${sha256(seed.qr_id).slice(0, 8).toUpperCase()}`,
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: sha256(seed.qr_id + seed.createdAt)
      }
    ],
    status: 'Active',
    createdAt: seed.createdAt || new Date().toISOString(),
    updatedAt: seed.updatedAt || new Date().toISOString(),
    connectedApps: ['UniQR Studio', 'Enterprise ERP'],
    entityType: seed.type,
    entityCode: seed.qr_id,
    identityNumber: seed.identity?.sku || seed.identity?.asset_number || seed.identity?.serial_number || seed.qr_id,
    organization: seed.identity?.brand || DEMO_COMPANY_NAME,
    relationships: (seed.relationships || []).map((relId: string) => ({
      id: `rel-${relId}`,
      sourceEntityId: seed.qr_id,
      targetEntityId: relId,
      targetEntityName: relId,
      relationType: 'ASSOCIATED_WITH'
    }))
  };
}

function seedDatabaseFromUniversalData() {
  let seeded = 0;
  for (const seed of UNIVERSAL_SEED_DATA) {
    const exists = db.products.some(p => p.uniqrCode === seed.qr_id || p.id === seed.qr_id);
    if (!exists) {
      db.products.push(convertSeedToProduct(seed));
      seeded++;
    }
  }
  if (seeded > 0) {
    saveDatabase(db);
    console.log(`[SEED] Inserted ${seeded} Universal Seed Data entities into db.json (owner: bhramitp@gmail.com)`);
  }
}

seedDatabaseFromUniversalData();

function getOrCreateProduct(qrParam: string): Product {
  const match = db.products.find(
    p => p.uniqrCode.toLowerCase() === qrParam.toLowerCase() ||
         p.id.toLowerCase() === qrParam.toLowerCase() ||
         (p.serialNumber && p.serialNumber.toLowerCase() === qrParam.toLowerCase())
  );
  if (match) return match;

  return {
    id: 'prod-dyn-' + qrParam,
    uniqrCode: qrParam,
    name: `Unregistered Product (${qrParam.length > 20 ? qrParam.slice(0, 20) + '…' : qrParam})`,
    sku: qrParam,
    brand: 'Unknown Brand',
    manufacturer: 'Not Registered',
    description: 'This QR code has not been registered in the UniQR platform yet. The product owner can register this identity through the UniQR Studio dashboard.',
    category: 'Unregistered',
    hsn: '',
    gst: 0,
    batchNumber: '',
    serialNumber: qrParam,
    mfgDate: '',
    expDate: '',
    warrantyMonths: 0,
    customFields: {
      'Registration Status': 'Not Registered',
      'QR Code': qrParam,
      'Scanned At': new Date().toISOString()
    },
    trailEvents: [],
    status: 'Unregistered',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'UniQR Engine',
    uptimeSeconds: process.uptime(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// ---- Mount Modular Domain Routers ----
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', createProductRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1', createTrailRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1', createAnalyticsRouter(db, saveDatabase));
app.use('/api/v1', createResolveRouter(getOrCreateProduct));
app.use('/api/v1', createDeveloperRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1', createPassportRouter(DATA_FILE));

app.listen(PORT, () => {
  console.log(`🚀 UniQR Digital Identity Engine running on port ${PORT}`);
  console.log(`🔒 Helmet security headers active | 📝 Request logger active`);
});
