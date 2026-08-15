import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, QrCode } from 'lucide-react';
import { Product, PassportConfig } from '../../types';
import { DEFAULT_PASSPORT_CONFIG } from '../../types/passport';
import { DynamicPassport } from './DynamicPassport';
import { storage } from '../../services/storage';
import { INITIAL_PRODUCTS } from '../../data/mockData';

interface PassportLoaderProps {
  qrCode: string;
  urlParams?: URLSearchParams;
  localProducts?: Product[];
  onBackToApp: () => void;
}

/**
 * PassportLoader — Dynamic Passport Resolution Engine
 * 
 * This component resolves the correct data for any scanned QR code by:
 * 1. Checking localStorage products & INITIAL_PRODUCTS (instant match for all known products)
 * 2. Fetching from /api/v1/resolve/:qr (Universal Seed Data — supports 16 entity types)
 * 3. Falling back to /api/v1/details/:qr (registered products in db.json)
 * 4. Showing "Unregistered Product" placeholder if nothing matches
 * 
 * For non-product entities (customer, work_order, warranty, guide, etc.), 
 * ALL attributes are flattened into customFields so they display on the passport page.
 */
export const PassportLoader: React.FC<PassportLoaderProps> = ({
  qrCode,
  urlParams,
  localProducts = [],
  onBackToApp
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<string>('product');
  const [passportConfig, setPassportConfig] = useState<PassportConfig>(DEFAULT_PASSPORT_CONFIG);

  useEffect(() => {
    if (!qrCode) {
      setLoading(false);
      setError('No QR code provided');
      return;
    }

    resolvePassportData();
  }, [qrCode]);

  const resolvePassportData = async () => {
    setLoading(true);
    setError(null);

    const cleanCode = qrCode.trim().toLowerCase();

    // Step 1: Check localStorage products and INITIAL_PRODUCTS (instant match, case-insensitive)
    const allLocal = [...localProducts, ...storage.getProducts(), ...INITIAL_PRODUCTS];
    const localMatch = allLocal.find(
      p => (p.uniqrCode && p.uniqrCode.toLowerCase() === cleanCode) || 
           (p.id && p.id.toLowerCase() === cleanCode) ||
           (p.sku && p.sku.toLowerCase() === cleanCode)
    );

    if (localMatch) {
      // Apply URL param overrides if present
      const paramName = urlParams?.get('name');
      const paramPrice = urlParams?.get('price');
      const merged = {
        ...localMatch,
        ...(paramName ? { name: paramName } : {}),
        ...(paramPrice ? { customFields: { ...localMatch.customFields, 'Price (₹)': `₹${paramPrice}` } } : {})
      };
      setProduct(merged);
      setEntityType(merged.entityType || 'product');
      setLoading(false);
      return;
    }

    // Step 2: Fetch from Universal Resolve API (checks UNIVERSAL_SEED_DATA — 20 entities, 16 types)
    try {
      const resolveRes = await fetch(`/api/v1/resolve/${encodeURIComponent(qrCode)}`);
      if (resolveRes.ok) {
        const data = await resolveRes.json();
        
        if (data && data.qr_id && data.type) {
          // Convert UniversalQRObject → Product shape for passport display
          const converted = convertUniversalToProduct(data);
          setProduct(converted);
          setEntityType(data.type || 'product');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Resolve API failed — try details API next
    }

    // Step 3: Fetch from Details API (checks db.json products + seed data via getOrCreateProduct)
    try {
      const detailsRes = await fetch(`/api/v1/details/${encodeURIComponent(qrCode)}`);
      if (detailsRes.ok) {
        const data = await detailsRes.json();
        if (data && data.rawProduct) {
          setProduct(data.rawProduct);
          setEntityType(data.rawProduct.category === 'Unregistered' ? 'unregistered' : 'product');
          setLoading(false);
          return;
        } else if (data && data.name) {
          // Partial data — build product from available fields
          const built: Product = {
            id: data.id || `prod-${qrCode}`,
            uniqrCode: data.qr || qrCode,
            name: data.name,
            sku: data.sku || data.model || qrCode,
            brand: data.brand || 'Unknown',
            manufacturer: data.manufacturer || '',
            description: data.description || '',
            category: data.category || 'Product',
            hsn: data.hsn || '',
            gst: data.gst_percent || 0,
            batchNumber: data.batch || '',
            serialNumber: data.serial || qrCode,
            mfgDate: data.mfg_date || '',
            expDate: data.expiry || '',
            warrantyMonths: data.warrantyMonths || 0,
            customFields: data.customFields || data.public_fields || {},
            builderSections: data.builderSections || [],
            trailEvents: [],
            status: data.status || 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            connectedApps: data.connectedApps || [],
            tags: [],
            location: '',
            supplier: ''
          };
          setProduct(built);
          setEntityType('product');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Details API also failed
    }

    // Step 4: Nothing worked — show unregistered placeholder
    setProduct(buildUnregisteredPlaceholder(qrCode));
    setEntityType('unregistered');
    setLoading(false);
  };

  // Resolve passport config after product is loaded
  useEffect(() => {
    if (!product) return;
    // Priority: per-entity config → global config → default
    if (product.passportConfig) {
      setPassportConfig(product.passportConfig);
    } else {
      const globalConfig = storage.getPassportConfig();
      setPassportConfig(globalConfig);
    }
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col items-center justify-center gap-6 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
        <div className="w-20 h-20 rounded-3xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center shadow-xl animate-pulse">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold text-[#1D4533]">Resolving Digital Identity</h2>
          <p className="text-sm text-[#5E3122] font-medium">Verifying QR token: <span className="font-mono font-bold">{qrCode}</span></p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#1D4533]" />
            <span className="text-xs font-bold text-[#1D4533]">Querying Universal Identity Engine…</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#5E3122] text-[#F9D2BA] flex items-center justify-center shadow-xl">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold text-[#5E3122]">Resolution Failed</h2>
          <p className="text-sm text-[#5E3122] font-medium">{error || 'Could not resolve QR identity'}</p>
        </div>
        <button
          onClick={onBackToApp}
          className="px-6 py-3 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-bold text-sm hover:bg-[#5E3122] transition-all"
        >
          Return to Platform
        </button>
      </div>
    );
  }

  // Render passport with resolved product and config
  return <DynamicPassport product={product} config={passportConfig} onBackToApp={onBackToApp} entityType={entityType} />;
};

// ----- Converters -----

/**
 * Convert a Universal QR Object (from /api/v1/resolve/:qr) into a Product
 * for the passport component. ALL fields from the universal object are
 * flattened into customFields so nothing is lost.
 */
function convertUniversalToProduct(data: any): Product {
  const customFields: Record<string, string> = {};

  // Helper to flatten any object into customFields with readable labels
  const flatten = (obj: Record<string, any> | undefined, prefix?: string) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, val] of Object.entries(obj)) {
      const label = (prefix ? `${prefix} — ` : '') + 
        key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      if (val !== null && val !== undefined && val !== '') {
        customFields[label] = typeof val === 'object' ? JSON.stringify(val) : String(val);
      }
    }
  };

  // Flatten ALL available data sections
  flatten(data.identity);
  flatten(data.attributes);
  flatten(data.commercial);
  flatten(data.contact);
  flatten(data.location);
  flatten(data.installation);
  flatten(data.coverage);
  flatten(data.assignment);
  flatten(data.schedule);
  flatten(data.translations);

  // Add meta fields
  customFields['Entity Type'] = data.type || 'unknown';
  customFields['Status'] = data.status || 'unknown';
  if (data.versioning?.enabled) {
    customFields['Version'] = String(data.versioning.current_version || 1);
  }

  // Add checks if present
  if (data.checks && Array.isArray(data.checks)) {
    data.checks.forEach((check: any, i: number) => {
      customFields[`Check ${i + 1} — ${check.name}`] = check.result;
    });
  }

  // Add steps if present
  if (data.steps && Array.isArray(data.steps)) {
    data.steps.forEach((step: any, i: number) => {
      const label = step.step_name || step.name || `Step ${i + 1}`;
      customFields[label] = step.status || step.result || JSON.stringify(step);
    });
  }

  // Add sections if present
  if (data.sections && Array.isArray(data.sections)) {
    data.sections.forEach((sec: any, i: number) => {
      customFields[sec.title || `Section ${i + 1}`] = sec.content || '';
    });
  }

  // Add related entities summary
  if (data.related_entities && data.related_entities.length > 0) {
    customFields['Related Entities'] = data.related_entities
      .map((r: any) => `${r.name} (${r.type})`)
      .join(', ');
  }

  // Determine display names based on entity type
  const entityName = data.identity?.name || data.identity?.title || data.identity?.asset_number || data.qr_id;
  const entityCategory = data.identity?.category || data.identity?.industry || 
    data.type?.charAt(0).toUpperCase() + data.type?.slice(1).replace(/_/g, ' ') || 'Product';

  const mfgDate = data.commercial?.manufacturing_date || data.commercial?.purchase_date || '';

  return {
    id: data.qr_id,
    uniqrCode: data.qr_id,
    name: entityName,
    sku: data.identity?.sku || data.identity?.model || data.identity?.asset_number || data.identity?.customer_code || data.qr_id,
    brand: data.identity?.brand || 'AGB Industrial Equipment Pvt. Ltd.',
    manufacturer: data.identity?.manufacturer || 'AGB Industrial Equipment Pvt. Ltd.',
    description: `${entityCategory} Identity Passport — ${entityName}`,
    category: entityCategory,
    hsn: data.identity?.hsn || '',
    gst: data.identity?.gst || 0,
    batchNumber: data.commercial?.invoice_number || '',
    serialNumber: data.identity?.serial_number || data.identity?.asset_number || data.qr_id,
    mfgDate,
    expDate: data.coverage?.warranty_end_date || data.coverage?.end_date || '',
    warrantyMonths: data.coverage?.duration_months || 0,
    customFields,
    builderSections: [],
    trailEvents: [],
    status: data.status || 'Active',
    createdAt: data.timestamp || new Date().toISOString(),
    updatedAt: data.timestamp || new Date().toISOString(),
    tags: [data.type, data.status, 'UniQR'].filter(Boolean),
    connectedApps: ['UniQR Studio', 'Enterprise ERP', 'Neo4j Graph Engine'],
    location: data.installation?.location || data.location?.city || data.location?.address || '',
    supplier: data.identity?.brand || 'AGB Industrial Equipment Pvt. Ltd.',

    // Universal Entity Extensions
    entityType: data.type || 'product',
    identityNumber: data.identity?.sku || data.identity?.model || data.identity?.asset_number || data.identity?.customer_code || data.qr_id,
    organization: data.identity?.brand || 'AGB Industrial Equipment Pvt. Ltd.',
    relationships: (data.related_entities || []).map((r: any) => ({
      id: `rel-${r.qr_id}`,
      sourceEntityId: data.qr_id,
      targetEntityId: r.qr_id,
      targetEntityName: r.name,
      targetEntityType: r.type,
      relationType: 'ASSOCIATED_WITH'
    })),
    scanBehavior: {
      isDynamic: true,
      requireAuth: false,
      enableLocationTracking: true,
      enableScanAnalytics: true,
      actions: [
        { id: 'act-1', label: `View ${entityCategory} Passport`, actionType: 'view_details' },
        { id: 'act-2', label: 'Verify Authenticity', actionType: 'verify_certificate' },
        { id: 'act-3', label: 'View Ledger Trail', actionType: 'view_details' }
      ]
    }
  };
}

/**
 * Build a minimal "Unregistered Product" placeholder for QR codes
 * that don't match anything in seed data or the product database.
 */
function buildUnregisteredPlaceholder(qrCode: string): Product {
  return {
    id: `unregistered-${qrCode}`,
    uniqrCode: qrCode,
    name: `Unregistered Product (${qrCode.length > 20 ? qrCode.slice(0, 20) + '…' : qrCode})`,
    sku: qrCode,
    brand: 'Unknown Brand',
    manufacturer: 'Not Registered',
    description: 'This QR code has not been registered in the UniQR platform. The product owner can register this identity through the UniQR Studio dashboard.',
    category: 'Unregistered',
    hsn: '',
    gst: 0,
    batchNumber: '',
    serialNumber: qrCode,
    mfgDate: '',
    expDate: '',
    warrantyMonths: 0,
    customFields: {
      'Registration Status': 'Not Registered',
      'QR Code': qrCode,
      'First Seen': new Date().toISOString()
    },
    builderSections: [],
    trailEvents: [],
    status: 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Unregistered'],
    connectedApps: [],
    location: '',
    supplier: ''
  };
}
