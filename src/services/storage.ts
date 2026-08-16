import { Product, QrCodeRecord, GraphNode, GraphLink, ScanEvent, SubscriptionTier, ApiKeyRecord, AuditLog, QrStylingConfig, PassportConfig } from '../types';
import { DEFAULT_PASSPORT_CONFIG } from '../types/passport';
import { INITIAL_PRODUCTS, INITIAL_QR_RECORDS, INITIAL_GRAPH_NODES, INITIAL_GRAPH_LINKS, INITIAL_SCANS, SUBSCRIPTION_TIERS, INITIAL_API_KEYS, INITIAL_AUDIT_LOGS } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'uniqr_products',
  QR_RECORDS: 'uniqr_qr_records',
  GRAPH_NODES: 'uniqr_graph_nodes',
  GRAPH_LINKS: 'uniqr_graph_links',
  SCANS: 'uniqr_scans',
  SUBSCRIPTION: 'uniqr_subscription',
  API_KEYS: 'uniqr_api_keys',
  AUDIT_LOGS: 'uniqr_audit_logs',
  PASSPORT_CONFIG: 'uniqr_passport_config',
};

class StorageService {
  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QR_RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.QR_RECORDS, JSON.stringify(INITIAL_QR_RECORDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRAPH_NODES)) {
      localStorage.setItem(STORAGE_KEYS.GRAPH_NODES, JSON.stringify(INITIAL_GRAPH_NODES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRAPH_LINKS)) {
      localStorage.setItem(STORAGE_KEYS.GRAPH_LINKS, JSON.stringify(INITIAL_GRAPH_LINKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCANS)) {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(INITIAL_SCANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify({
        planId: 'free',
        dailyUsed: 0,
        totalLifetimeGenerated: INITIAL_QR_RECORDS.length,
        subscribedAt: '2026-07-01'
      }));
    }
    if (!localStorage.getItem(STORAGE_KEYS.API_KEYS)) {
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(INITIAL_API_KEYS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  // Products
  getProducts(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    } catch {
      return [];
    }
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id || p.uniqrCode === id);
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Async REST API sync to backend
    fetch('/api/v1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).catch(() => {});

    // Also register in Neo4j Graph
    const nodeType = (product.entityType
      ? product.entityType.charAt(0).toUpperCase() + product.entityType.slice(1)
      : 'Product') as any;

    this.addGraphNode({
      id: product.id,
      label: product.name,
      type: nodeType,
      details: {
        Identifier: product.identityNumber || product.sku || '',
        Type: product.entityType || 'product',
        Brand: product.brand || product.manufacturer || '',
        Category: product.category || 'General'
      }
    });

    this.addGraphLink({
      source: 'company-agb',
      target: product.id,
      relation: 'CREATED'
    });

    // Register all inter-entity graph relationships
    if (product.relationships && product.relationships.length > 0) {
      product.relationships.forEach(rel => {
        this.addGraphLink({
          source: product.id,
          target: rel.targetEntityId,
          relation: (rel.relationType || 'ASSOCIATED_WITH') as any
        });
      });
    }

    this.addAuditLog('Entity Registered', `Saved universal ${product.entityType || 'product'} "${product.name}" (${product.uniqrCode})`);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    fetch(`/api/v1/products/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // QR Records
  getQrRecords(): QrCodeRecord[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QR_RECORDS) || '[]');
  }

  getQrByCode(code: string): QrCodeRecord | undefined {
    return this.getQrRecords().find(q => q.uniqrCode === code || q.productId === code);
  }

  createQrRecord(product: Product, styleConfig: QrStylingConfig): QrCodeRecord {
    const records = this.getQrRecords();
    const existingIndex = records.findIndex(q => q.uniqrCode === product.uniqrCode || q.productId === product.id);

    const publicUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/q/${product.uniqrCode}`
      : `https://uniqr.agbtechnologies.in/q/${product.uniqrCode}`;

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        uniqrCode: product.uniqrCode,
        productId: product.id,
        productName: product.name,
        styleConfig,
        publicUrl,
        status: 'Active'
      };
      localStorage.setItem(STORAGE_KEYS.QR_RECORDS, JSON.stringify(records));
      return records[existingIndex];
    }

    // Check subscription limits for newly generated QR codes
    const sub = this.getSubscription();
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === sub.planId) || SUBSCRIPTION_TIERS[0];
    
    if (tier.id === 'free' && tier.lifetimeCap && sub.totalLifetimeGenerated >= tier.lifetimeCap) {
      // Auto-bump or allow local evaluation
    }

    const newRecord: QrCodeRecord = {
      id: 'qr-' + Date.now(),
      uniqrCode: product.uniqrCode,
      productId: product.id,
      productName: product.name,
      styleConfig,
      publicUrl,
      createdAt: new Date().toISOString(),
      totalScans: 0,
      totalDownloads: 0,
      status: 'Active'
    };

    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.QR_RECORDS, JSON.stringify(records));

    // Update Subscription counter
    sub.totalLifetimeGenerated = (sub.totalLifetimeGenerated || 0) + 1;
    sub.dailyUsed = (sub.dailyUsed || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));

    // Graph node & links
    const qrNodeId = `qr-node-${product.uniqrCode}`;
    this.addGraphNode({
      id: qrNodeId,
      label: product.uniqrCode,
      type: 'QR',
      details: { Product: product.name, Status: 'Active' }
    });
    this.addGraphLink({
      source: product.id,
      target: qrNodeId,
      relation: 'HAS_QR'
    });

    // Link connected apps safely
    (product.connectedApps || []).forEach(appName => {
      const appId = `app-${appName.toLowerCase().replace(/\s+/g, '')}`;
      this.addGraphNode({
        id: appId,
        label: `${appName} Integration`,
        type: 'App',
        details: { Status: 'Active Sync' }
      });
      this.addGraphLink({
        source: qrNodeId,
        target: appId,
        relation: 'CONNECTED_TO'
      });
    });

    this.addAuditLog('QR Generated', `Generated permanent QR for ${product.name} (${product.uniqrCode})`);

    return newRecord;
  }

  incrementDownloadCount(uniqrCode: string): void {
    const records = this.getQrRecords();
    const r = records.find(x => x.uniqrCode === uniqrCode);
    if (r) {
      r.totalDownloads += 1;
      localStorage.setItem(STORAGE_KEYS.QR_RECORDS, JSON.stringify(records));
    }
  }

  recordScan(uniqrCode: string, deviceInfo: Partial<ScanEvent> = {}): void {
    const records = this.getQrRecords();
    const r = records.find(x => x.uniqrCode === uniqrCode);
    if (r) {
      r.totalScans += 1;
      r.lastScannedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.QR_RECORDS, JSON.stringify(records));
    }

    const scans = this.getScans();
    const newScan: ScanEvent = {
      id: 'scan-' + Date.now(),
      uniqrCode,
      productName: (r && r.productName) ? r.productName : 'Product Scan',
      timestamp: new Date().toISOString(),
      country: deviceInfo.country || 'India',
      city: deviceInfo.city || 'Bengaluru',
      device: deviceInfo.device || 'Mobile',
      os: deviceInfo.os || 'Android 15',
      browser: deviceInfo.browser || 'Chrome Mobile',
      referral: deviceInfo.referral || 'Camera Scan',
      appSource: deviceInfo.appSource || 'Web Camera',
      isRepeat: deviceInfo.isRepeat ?? false
    };

    scans.unshift(newScan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  }

  // Graph
  getGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
    return {
      nodes: JSON.parse(localStorage.getItem(STORAGE_KEYS.GRAPH_NODES) || '[]'),
      links: JSON.parse(localStorage.getItem(STORAGE_KEYS.GRAPH_LINKS) || '[]')
    };
  }

  addGraphNode(node: GraphNode): void {
    const nodes: GraphNode[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.GRAPH_NODES) || '[]');
    if (!nodes.some(n => n.id === node.id)) {
      nodes.push(node);
      localStorage.setItem(STORAGE_KEYS.GRAPH_NODES, JSON.stringify(nodes));
    }
  }

  addGraphLink(link: GraphLink): void {
    const links: GraphLink[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.GRAPH_LINKS) || '[]');
    if (!links.some(l => l.source === link.source && l.target === link.target && l.relation === link.relation)) {
      links.push(link);
      localStorage.setItem(STORAGE_KEYS.GRAPH_LINKS, JSON.stringify(links));
    }
  }

  // Scans
  getScans(): ScanEvent[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCANS) || '[]');
  }

  // Subscription
  getSubscription() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION) || '{}');
  }

  updateSubscription(planId: string) {
    const sub = this.getSubscription();
    sub.planId = planId;
    sub.subscribedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    this.addAuditLog('Subscription Upgrade', `Upgraded plan to ${planId.toUpperCase()}`);
  }

  // API Keys
  getApiKeys(): ApiKeyRecord[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.API_KEYS) || '[]');
  }

  createApiKey(name: string): ApiKeyRecord {
    const keys = this.getApiKeys();
    const randomHex = Array.from({length: 24}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey: ApiKeyRecord = {
      id: 'key-' + Date.now(),
      name,
      keySecret: `uq_live_${randomHex}`,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    keys.unshift(newKey);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    this.addAuditLog('API Key Created', `Created API key "${name}"`);
    return newKey;
  }

  deleteApiKey(id: string): void {
    const keys = this.getApiKeys().filter(k => k.id !== id);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  }

  // Audit logs
  getAuditLogs(): AuditLog[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  }

  addAuditLog(action: string, details: string) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      user: 'admin@agbtechnologies.in',
      ip: '49.207.19.88',
      details
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  // ── Passport Config ──────────────────────────────────────────────────

  getPassportConfig(): PassportConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSPORT_CONFIG);
    if (raw) {
      try {
        return JSON.parse(raw) as PassportConfig;
      } catch {
        return { ...DEFAULT_PASSPORT_CONFIG };
      }
    }
    return { ...DEFAULT_PASSPORT_CONFIG };
  }

  savePassportConfig(config: PassportConfig): void {
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PASSPORT_CONFIG, JSON.stringify(config));

    // Async backend sync
    fetch('/api/v1/passport-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).catch(() => {});

    this.addAuditLog('Passport Config Updated', `Updated passport theme "${config.name}"`);
  }

  getPassportConfigForProduct(productId: string): PassportConfig {
    const product = this.getProductById(productId);
    if (product?.passportConfig) {
      return product.passportConfig;
    }
    return this.getPassportConfig();
  }
}

export const storage = new StorageService();
