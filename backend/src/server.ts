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
import { authRouter, decodeJwtPayload } from './routes/auth.routes.js';
import { createProductRouter } from './routes/product.routes.js';
import { createTrailRouter } from './routes/trail.routes.js';
import { billingRouter } from './routes/billing.routes.js';
import { createAnalyticsRouter } from './routes/analytics.routes.js';
import { createResolveRouter } from './routes/resolve.routes.js';
import { createDeveloperRouter } from './routes/developer.routes.js';
import { createPassportRouter } from './routes/passport.routes.js';
import { blobRouter } from './routes/blobRoutes.js';
import { postgresClient } from './domains/db/postgresClient.js';
import { sessionEngine } from './domains/auth/sessionEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '.env')
];

for (const p of possibleEnvPaths) {
  if (fs.existsSync(p)) {
    const envContent = fs.readFileSync(p, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
    break;
  }
}

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

const UPLOADS_ROOT = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_ROOT));

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

// Industrial QR Sizing & Vector Configuration Endpoint
app.get('/api/v1/qr/size-presets', (req: Request, res: Response) => {
  res.json({
    status: 'SUCCESS',
    presets: [
      {
        id: 'xs',
        name: 'Extra Small (XS)',
        targetUseCase: 'Business cards, small product tags, packaging inserts',
        minimumPrintDimensions: '2.0 × 2.0 cm (0.8 × 0.8 in)',
        digitalResolution300DPI: '236 × 236 px',
        quietZoneMargin: '4 modules (~1.5 mm)',
        pixelSize: 236
      },
      {
        id: 's',
        name: 'Small (S)',
        targetUseCase: 'Flyers, brochures, restaurant menus, stickers',
        minimumPrintDimensions: '3.0 × 3.0 cm (1.2 × 1.2 in)',
        digitalResolution300DPI: '354 × 354 px',
        quietZoneMargin: '4 modules (~2.0 mm)',
        pixelSize: 354
      },
      {
        id: 'm',
        name: 'Medium (M)',
        targetUseCase: 'Desktop stands, magazine ads, window decals',
        minimumPrintDimensions: '5.0 × 5.0 cm (2.0 × 2.0 in)',
        digitalResolution300DPI: '590 × 590 px',
        quietZoneMargin: '4 modules (~3.5 mm)',
        pixelSize: 590
      },
      {
        id: 'l',
        name: 'Large (L)',
        targetUseCase: 'Posters, trade show roll-ups, outdoor banners',
        minimumPrintDimensions: '15.0 × 15.0 cm (6.0 × 6.0 in)',
        digitalResolution300DPI: '1772 × 1772 px',
        quietZoneMargin: '4 modules (~10 mm)',
        pixelSize: 1772
      },
      {
        id: 'xl',
        name: 'Extra Large (XL)',
        targetUseCase: 'Billboards, highway signage, building facades',
        minimumPrintDimensions: '100.0 × 100.0 cm (39.4 × 39.4 in)',
        digitalResolution300DPI: '11811 × 11811 px',
        quietZoneMargin: '4 modules (~67 mm)',
        pixelSize: 11811
      }
    ]
  });
});

// ---- Mount Modular Domain Routers ----
app.use('/api/v1/auth', authRouter);
app.use('/api/auth', authRouter); // Also mount at /api/auth for OAuth callbacks

// Google OAuth Callback Redirect Endpoint
app.get(['/api/auth/callback/google', '/api/v1/auth/google/callback', '/api/v1/auth/callback/google'], async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.redirect('/app/auth?error=no_code');
  }

  let returnOrigin = 'https://uniqr.agbtechnologies.in';
  try {
    if (req.query.state) {
      const parsedState = JSON.parse(decodeURIComponent(req.query.state as string));
      if (parsedState.origin && (parsedState.origin.includes('localhost') || parsedState.origin.includes('127.0.0.1') || parsedState.origin.includes('agbtechnologies.in'))) {
        returnOrigin = parsedState.origin;
      }
    }
  } catch (e) {}

  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
    
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: 'https://uniqr.agbtechnologies.in/api/auth/callback/google',
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenRes.json();
    let googleUser: any = null;

    if (tokenData.access_token) {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      googleUser = await userRes.json();
    } else if (tokenData.id_token) {
      googleUser = decodeJwtPayload(tokenData.id_token);
    }

    if (googleUser && googleUser.email) {
      const email = googleUser.email.toLowerCase().trim();
      let user = await postgresClient.findUserByEmail(email);
      const firstName = googleUser.given_name || (googleUser.name ? googleUser.name.split(' ')[0] : email.split('@')[0]);
      const lastName = googleUser.family_name || (googleUser.name ? googleUser.name.split(' ').slice(1).join(' ') : '');
      const fullName = googleUser.name || `${firstName} ${lastName}`.trim();
      const avatarUrl = googleUser.picture || '';

      if (!user) {
        user = await postgresClient.createUser({
          email,
          name: fullName,
          firstName,
          lastName,
          googleId: googleUser.sub,
          avatarUrl
        });
      } else {
        await postgresClient.updateUserProfile(user.id, {
          googleId: googleUser.sub,
          avatarUrl: avatarUrl || user.avatarUrl,
          firstName: user.firstName || firstName,
          lastName: user.lastName || lastName
        });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';
      const sessionContext = await sessionEngine.rotateSession('', user, clientIp, userAgent);

      res.cookie('uq_session', sessionContext.rawToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });

      console.log(`[GOOGLE OAUTH REDIRECT SUCCESS] User: ${user.email} (${user.name}) -> Returning to: ${returnOrigin}`);

      const userJson = JSON.stringify({
        id: user.id,
        email: user.email,
        phone: user.phone || '',
        name: user.name,
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
        organization: user.organization || 'AGB Technologies Ltd.',
        hasGstin: user.hasGstin || false,
        gstin: user.gstin || '',
        avatarUrl: user.avatarUrl || avatarUrl,
        role: user.role,
        requiresPhone: !user.phone
      });

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>UniQR Authentication</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="background:#0E1A14;color:#F7EAE0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;padding:24px;border:2px solid #F9D2BA;border-radius:24px;background:#1D4533;max-width:380px;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
            <img src="/logo.jpg" style="width:60px;height:60px;border-radius:16px;margin-bottom:12px;" />
            <h2 style="margin:0 0 8px 0;font-size:20px;color:#F9D2BA;">⚡ Google Sign-In Verified</h2>
            <p style="margin:0 0 16px 0;font-size:13px;color:#F7EAE0;opacity:0.9;">Welcome, <strong>${fullName}</strong>! Redirecting to your workspace...</p>
            <div style="font-size:11px;opacity:0.7;">Account: ${email}</div>
          </div>
          <script>
            try {
              localStorage.setItem('uniqr_auth_token', '${sessionContext.rawToken}');
              localStorage.setItem('uniqr_user', JSON.stringify(${userJson}));
            } catch (e) {}
            setTimeout(() => {
              window.location.href = '${returnOrigin}/app/dashboard';
            }, 600);
          </script>
        </body>
        </html>
      `);
    }
  } catch (e: any) {
    console.error('[GOOGLE CALLBACK ERROR]', e.message);
  }
  return res.redirect(`${returnOrigin}/app/auth?error=google_oauth_failed`);
});

app.use('/api/v1', createProductRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1', createTrailRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1', createAnalyticsRouter(db, saveDatabase));
app.use('/api/v1', createResolveRouter(getOrCreateProduct));
app.use('/api/v1', createDeveloperRouter(db, saveDatabase, getOrCreateProduct));
app.use('/api/v1', createPassportRouter(DATA_FILE));
app.use('/api/v1/blobs', blobRouter);

app.listen(PORT, () => {
  console.log(`🚀 UniQR Digital Identity Engine running on port ${PORT}`);
  console.log(`🔒 Helmet security headers active | 📝 Request logger active`);
});
