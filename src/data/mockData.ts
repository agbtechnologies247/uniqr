import { Product, QrCodeRecord, GraphNode, GraphLink, ScanEvent, SubscriptionTier, ApiKeyRecord, AuditLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_QR_RECORDS: QrCodeRecord[] = [];

export const INITIAL_GRAPH_NODES: GraphNode[] = [];

export const INITIAL_GRAPH_LINKS: GraphLink[] = [];

export const INITIAL_SCANS: ScanEvent[] = [];

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
    description: 'Basic product identification for testing and personal cataloging.',
    features: [
      'Lifetime Free (No Expiry)',
      'Up to 10 Active Product QRs',
      'Standard PNG & SVG Exports',
      'Basic Product Identity Passport',
      'Tamper-Evident Trail Verification'
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
    description: 'Dynamic QR codes, 8192px ultra-high resolution export and geo analytics for growing brands.',
    features: [
      'Everything in Starter Free',
      'Up to 50 Product QRs / Mo',
      '8192px Ultra High Res Exports',
      'Tamper-Evident SHA-256 Ledgers',
      '30-Day Deep Geo Attribution Analytics',
      '3 Team Seats'
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
    description: 'Complete industrial intelligence with Neo4j entity graphs and laser vector SVG.',
    features: [
      'Up to 500 Product QRs / Mo',
      'Laser / Vector Engraving SVG & CAD',
      'AI Decision Engine & Anomaly Detection',
      'Neo4j Relationship Graph Cluster',
      '90-Day Realtime Telemetry',
      '10 Team Seats'
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
    description: 'High-speed assembly-line stamping, factory batch issuance and 1-year telemetry.',
    features: [
      'Up to 5,000 Product QRs / Mo',
      'High-Speed Batch Stamping & Issuance',
      'Dedicated Merkle Ledger Chain',
      'Assembly Line AI Filter & Quality Gate',
      '1-Year Deep Telemetry Archive',
      '25 Team Seats'
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
    qrLimitDaily: 100000,
    description: 'Unlimited custom QR capacity, dedicated DB instance and custom SLA.',
    features: [
      'Unlimited Custom QR Stamping',
      'Dedicated Database Instance & SLA',
      'Custom CAD / Vector Export Formats',
      'Dedicated Machine Learning Cluster',
      'Unlimited Historical Archives',
      'Unlimited Team Members'
    ]
  }
];

export const INITIAL_API_KEYS: ApiKeyRecord[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
