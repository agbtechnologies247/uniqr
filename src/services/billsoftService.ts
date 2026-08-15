import { BillSoftEntityType, BillSoftQrIdentity, BillSoftEntityItem, GraphNode, GraphLink } from '../types';

const BILLSOFT_STORAGE_KEYS = {
  IDENTITIES: 'billsoft_qr_identities',
  ENTITIES: 'billsoft_entities',
  GRAPH_NODES: 'billsoft_graph_nodes',
  GRAPH_LINKS: 'billsoft_graph_links',
};

// Initial Seed Entities according to billsoft_integration.md
const SEED_ENTITIES: BillSoftEntityItem[] = [
  {
    id: 'bs-prod-1001',
    type: 'Product',
    publicQrId: 'BS-PROD-00001001',
    name: 'Heavy Duty Thermal POS Printer',
    codeOrSku: 'SKU-POS-80MM',
    categoryOrRole: 'Hardware & POS',
    status: 'Active',
    createdAt: '2026-07-20T10:00:00Z',
    details: {
      Price: '₹14,500',
      GST: '18%',
      Brand: 'BillSoft Tech',
      Warranty: '24 Months',
      Location: 'Main Warehouse Bin A-12',
    },
    neo4jRelations: [
      { relation: 'STORED_IN', targetId: 'bs-wh-01', targetName: 'Central Logistics Hub', targetType: 'Warehouse' },
      { relation: 'SUPPLIED_BY', targetId: 'bs-sup-55', targetName: 'AGB Hardware Ltd', targetType: 'Supplier' },
      { relation: 'PART_OF_BATCH', targetId: 'bs-batch-44', targetName: 'Batch #B2026-07', targetType: 'Stock Batch' },
    ]
  },
  {
    id: 'bs-cust-145',
    type: 'Customer',
    publicQrId: 'BS-CUST-00000145',
    name: 'Apex Retail Enterprises',
    codeOrSku: 'CUST-APEX-99',
    categoryOrRole: 'Enterprise Wholesale',
    status: 'Active',
    createdAt: '2026-06-15T08:30:00Z',
    details: {
      Contact: 'Rajesh Sharma',
      Email: 'accounts@apexretail.in',
      GSTIN: '29ABCDE1234F1Z5',
      RewardPoints: '1,450 pts',
      ActiveRentals: '2 Assets',
    },
    neo4jRelations: [
      { relation: 'BOUGHT', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
      { relation: 'PURCHASED', targetId: 'bs-inv-4001', targetName: 'Invoice #INV-2026-891', targetType: 'Invoice' },
      { relation: 'RENTED', targetId: 'bs-rent-900', targetName: 'Industrial Barcode Scanner Rig', targetType: 'Rental Asset' },
      { relation: 'HAS_WARRANTY', targetId: 'bs-war-33', targetName: '2-Year Premium POS Hardware Warranty', targetType: 'Warranty' },
    ]
  },
  {
    id: 'bs-wh-01',
    type: 'Warehouse',
    publicQrId: 'BS-WH-00000001',
    name: 'Central Logistics Hub',
    codeOrSku: 'WH-BLR-NORTH',
    categoryOrRole: 'Distribution Hub',
    status: 'Active',
    createdAt: '2026-05-10T11:00:00Z',
    details: {
      Capacity: '50,000 Units',
      Zones: 'Shelf A1 to D40',
      Manager: 'Vikram Singh',
      Pincode: '560001',
    },
    neo4jRelations: [
      { relation: 'CONTAINS', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
      { relation: 'TRANSFERRED_TO', targetId: 'bs-wh-02', targetName: 'South Retail Store Depot', targetType: 'Warehouse' },
    ]
  },
  {
    id: 'bs-inv-4001',
    type: 'Invoice',
    publicQrId: 'BS-INV-00004001',
    name: 'Invoice #INV-2026-891',
    codeOrSku: 'INV-2026-891',
    categoryOrRole: 'GST B2B Invoice',
    status: 'Paid',
    createdAt: '2026-07-28T14:15:00Z',
    details: {
      Amount: '₹34,220',
      PaymentMode: 'UPI / NetBanking',
      DueDate: '2026-08-15',
      ItemsCount: '3 Items',
    },
    neo4jRelations: [
      { relation: 'SOLD_TO', targetId: 'bs-cust-145', targetName: 'Apex Retail Enterprises', targetType: 'Customer' },
      { relation: 'CONTAINS', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
      { relation: 'GENERATED_WARRANTY', targetId: 'bs-war-33', targetName: '2-Year Premium POS Hardware Warranty', targetType: 'Warranty' },
    ]
  },
  {
    id: 'bs-rent-900',
    type: 'Rental Asset',
    publicQrId: 'BS-RENT-00000900',
    name: 'Industrial Barcode Scanner Rig',
    codeOrSku: 'RENT-SCAN-900',
    categoryOrRole: 'Equipment Rental',
    status: 'Rented Out',
    createdAt: '2026-07-01T09:00:00Z',
    details: {
      Deposit: '₹5,000',
      DailyRate: '₹250/day',
      ReturnDate: '2026-08-20',
      Condition: 'Excellent',
    },
    neo4jRelations: [
      { relation: 'RENTED_TO', targetId: 'bs-cust-145', targetName: 'Apex Retail Enterprises', targetType: 'Customer' },
    ]
  },
  {
    id: 'bs-war-33',
    type: 'Warranty',
    publicQrId: 'BS-WAR-00000033',
    name: '2-Year Premium POS Hardware Warranty',
    codeOrSku: 'WAR-POS-2Y',
    categoryOrRole: 'Comprehensive SLA',
    status: 'Active',
    createdAt: '2026-07-28T14:15:00Z',
    details: {
      PurchaseDate: '2026-07-28',
      ExpiryDate: '2028-07-28',
      Coverage: 'Parts & Labor',
      ServiceCount: '0 Claims',
    },
    neo4jRelations: [
      { relation: 'COVERED_BY', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
    ]
  },
  {
    id: 'bs-srv-77',
    type: 'Service Ticket',
    publicQrId: 'BS-SRV-00000077',
    name: 'Ticket #SRV-9921 - Printhead Calibration',
    codeOrSku: 'SRV-9921',
    categoryOrRole: 'On-Site Maintenance',
    status: 'In Progress',
    createdAt: '2026-08-01T11:20:00Z',
    details: {
      Technician: 'Anil Kumar',
      Priority: 'High',
      EstimatedFix: '24 Hours',
      PartsReplaced: 'Thermal Ribbon Assembly',
    },
    neo4jRelations: [
      { relation: 'SERVICED_AT', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
    ]
  },
  {
    id: 'bs-batch-44',
    type: 'Stock Batch',
    publicQrId: 'BS-BATCH-00000044',
    name: 'Batch #B2026-07 (Thermal Components)',
    codeOrSku: 'BATCH-2026-07',
    categoryOrRole: 'Component Lot',
    status: 'Verified',
    createdAt: '2026-07-01T07:00:00Z',
    details: {
      MfgDate: '2026-06-25',
      ExpiryDate: '2029-06-25',
      LotQuantity: '1,000 Units',
      Inspector: 'QC Desk 3',
    },
    neo4jRelations: [
      { relation: 'USED_IN', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
    ]
  },
  {
    id: 'bs-sup-55',
    type: 'Supplier',
    publicQrId: 'BS-SUP-00000055',
    name: 'AGB Hardware Solutions Ltd',
    codeOrSku: 'SUP-AGB-01',
    categoryOrRole: 'Tier 1 Vendor',
    status: 'Verified',
    createdAt: '2026-01-10T10:00:00Z',
    details: {
      Rating: '4.9 ★',
      LeadTime: '3 Days',
      Contact: 'supplies@agbhardware.com',
      ActivePOs: '4 Orders',
    },
    neo4jRelations: [
      { relation: 'SUPPLIES', targetId: 'bs-prod-1001', targetName: 'Heavy Duty Thermal POS Printer', targetType: 'Product' },
    ]
  }
];

class BillSoftService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(BILLSOFT_STORAGE_KEYS.ENTITIES)) {
      localStorage.setItem(BILLSOFT_STORAGE_KEYS.ENTITIES, JSON.stringify(SEED_ENTITIES));
    }
    if (!localStorage.getItem(BILLSOFT_STORAGE_KEYS.IDENTITIES)) {
      const initialIdentities = SEED_ENTITIES.map(e => this.buildQrIdentityRecord(e));
      localStorage.setItem(BILLSOFT_STORAGE_KEYS.IDENTITIES, JSON.stringify(initialIdentities));
    }
  }

  // Generate UUID v4 format
  public generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Generate public QR ID prefix format (e.g. BS-PROD-00001254)
  public generatePublicQrId(type: BillSoftEntityType): string {
    const prefixMap: Record<BillSoftEntityType, string> = {
      'Product': 'BS-PROD',
      'Customer': 'BS-CUST',
      'Invoice': 'BS-INV',
      'Rental Asset': 'BS-RENT',
      'Warehouse': 'BS-WH',
      'Stock Batch': 'BS-BATCH',
      'Warranty': 'BS-WAR',
      'Service Ticket': 'BS-SRV',
      'Purchase': 'BS-PO',
      'Supplier': 'BS-SUP',
      'Employee': 'BS-EMP',
    };

    const prefix = prefixMap[type] || 'BS-ENT';
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNum}`;
  }

  // Build encrypted security token
  public generateEncryptedToken(publicQrId: string, uuid: string): string {
    const raw = `${publicQrId}:${uuid}:${Date.now()}:BILLSOFT-SECRET-KEY`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'TOK-' + Math.abs(hash).toString(16).toUpperCase() + '-' + uuid.slice(0, 8);
  }

  private buildQrIdentityRecord(entity: BillSoftEntityItem): BillSoftQrIdentity {
    const uuid = this.generateUuid();
    return {
      id: 'qrid-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      uuid,
      entityType: entity.type,
      entityId: entity.id,
      publicQrId: entity.publicQrId,
      encryptedToken: this.generateEncryptedToken(entity.publicQrId, uuid),
      status: 'Active',
      createdAt: entity.createdAt,
      scanCount: Math.floor(Math.random() * 25) + 3,
      lastScan: new Date().toISOString(),
      neo4jNodeId: `Node:${entity.type}:${entity.id.replace('bs-', '')}`,
      publicUrl: `https://billsoft.agbtechnologies.com/q/${entity.publicQrId}`,
      customMetadata: entity.details,
    };
  }

  // Get all entities
  public getEntities(): BillSoftEntityItem[] {
    return JSON.parse(localStorage.getItem(BILLSOFT_STORAGE_KEYS.ENTITIES) || '[]');
  }

  // Get all QR Identity records (PostgreSQL qr_identity table equivalent)
  public getQrIdentities(): BillSoftQrIdentity[] {
    return JSON.parse(localStorage.getItem(BILLSOFT_STORAGE_KEYS.IDENTITIES) || '[]');
  }

  // Create new Entity & auto-register QR Identity + Neo4j Node
  public createEntity(data: {
    name: string;
    type: BillSoftEntityType;
    codeOrSku: string;
    categoryOrRole?: string;
    details: Record<string, string>;
  }): BillSoftEntityItem {
    const entities = this.getEntities();
    const identities = this.getQrIdentities();

    const publicQrId = this.generatePublicQrId(data.type);
    const newId = 'bs-' + data.type.toLowerCase().slice(0, 4) + '-' + Math.floor(1000 + Math.random() * 9000);

    const newEntity: BillSoftEntityItem = {
      id: newId,
      type: data.type,
      publicQrId,
      name: data.name,
      codeOrSku: data.codeOrSku,
      categoryOrRole: data.categoryOrRole || 'General',
      status: 'Active',
      createdAt: new Date().toISOString(),
      details: data.details,
      neo4jRelations: []
    };

    entities.unshift(newEntity);
    localStorage.setItem(BILLSOFT_STORAGE_KEYS.ENTITIES, JSON.stringify(entities));

    const identityRecord = this.buildQrIdentityRecord(newEntity);
    identities.unshift(identityRecord);
    localStorage.setItem(BILLSOFT_STORAGE_KEYS.IDENTITIES, JSON.stringify(identities));

    return newEntity;
  }

  // Universal QR Token Resolver (simulates /api/qr/resolve)
  public resolveQr(publicQrIdOrUrl: string): {
    success: boolean;
    identity?: BillSoftQrIdentity;
    entity?: BillSoftEntityItem;
    message: string;
  } {
    const cleanId = publicQrIdOrUrl.includes('/q/')
      ? publicQrIdOrUrl.split('/q/')[1]
      : publicQrIdOrUrl.trim();

    const identities = this.getQrIdentities();
    const identity = identities.find(i => i.publicQrId.toLowerCase() === cleanId.toLowerCase() || i.uuid === cleanId);

    if (!identity) {
      return {
        success: false,
        message: `No active identity found matching '${cleanId}' in BillSoft UQIS registry.`
      };
    }

    // Increment scan counter
    identity.scanCount += 1;
    identity.lastScan = new Date().toISOString();
    localStorage.setItem(BILLSOFT_STORAGE_KEYS.IDENTITIES, JSON.stringify(identities));

    const entities = this.getEntities();
    const entity = entities.find(e => e.id === identity.entityId || e.publicQrId === identity.publicQrId);

    return {
      success: true,
      identity,
      entity,
      message: `Identity resolved successfully: [${identity.entityType}] ${entity ? entity.name : identity.publicQrId}`
    };
  }

  // Generate Neo4j Graph Data for visualizer
  public getGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
    const entities = this.getEntities();
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    entities.forEach((ent) => {
      let nodeType: GraphNode['type'] = 'Product';
      if (ent.type === 'Customer') nodeType = 'Customer';
      if (ent.type === 'Invoice') nodeType = 'Invoice';
      if (ent.type === 'Warehouse') nodeType = 'Warehouse';
      if (ent.type === 'Supplier') nodeType = 'Supplier';
      if (ent.type === 'Warranty') nodeType = 'Warranty';
      if (ent.type === 'Rental Asset') nodeType = 'RentalItem';
      if (ent.type === 'Service Ticket') nodeType = 'ServiceTicket';
      if (ent.type === 'Stock Batch') nodeType = 'Batch';
      if (ent.type === 'Employee') nodeType = 'Employee';

      nodes.push({
        id: ent.id,
        label: ent.name,
        type: nodeType,
        details: {
          PublicQR: ent.publicQrId,
          Type: ent.type,
          Code: ent.codeOrSku,
          ...ent.details
        }
      });

      // Add QR Node
      const qrNodeId = `qr-${ent.publicQrId}`;
      nodes.push({
        id: qrNodeId,
        label: ent.publicQrId,
        type: 'QR',
        details: { Entity: ent.name, Type: ent.type }
      });

      links.push({
        source: ent.id,
        target: qrNodeId,
        relation: 'HAS_QR'
      });

      // Add declared relations
      ent.neo4jRelations.forEach((rel) => {
        links.push({
          source: ent.id,
          target: rel.targetId,
          relation: rel.relation as any
        });
      });
    });

    return { nodes, links };
  }

  // Generate PostgreSQL DDL SQL Export
  public generateMigrationSql(): string {
    return `-- =========================================================
-- BillSoft Universal QR Identity System (UQIS) Schema
-- PostgreSQL Master Transactional Database Script
-- Generated for VPS: 82.29.164.106 (root@mail:/var/www)
-- Target: BillSoft IAT & PROD DBs
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum for QR Identity Status
DO $$ BEGIN
    CREATE TYPE qr_status_enum AS ENUM ('Active', 'Revoked', 'Archived', 'Suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Create Universal QR Identity Table (qr_identity)
CREATE TABLE IF NOT EXISTS qr_identity (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    public_qr_id VARCHAR(128) UNIQUE NOT NULL,
    encrypted_token TEXT NOT NULL,
    status qr_status_enum DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_scan TIMESTAMP WITH TIME ZONE,
    scan_count INT DEFAULT 0,
    neo4j_node_id VARCHAR(256),
    public_url TEXT NOT NULL,
    custom_metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for lightning fast resolver lookups (< 2ms)
CREATE INDEX IF NOT EXISTS idx_qr_identity_public_qr_id ON qr_identity(public_qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_identity_uuid ON qr_identity(uuid);
CREATE INDEX IF NOT EXISTS idx_qr_identity_entity ON qr_identity(entity_type, entity_id);

-- 2. Audit Trail Trigger Function
CREATE OR REPLACE FUNCTION log_qr_scan_event()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE qr_identity 
    SET last_scan = CURRENT_TIMESTAMP, 
        scan_count = scan_count + 1 
    WHERE public_qr_id = NEW.public_qr_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;
  }

  // Generate Neo4j Cypher Script Export
  public generateCypherScripts(): string {
    return `// =========================================================
// BillSoft Universal QR Identity System (UQIS) Cypher Script
// Neo4j Relationship Engine Script
// Target: Neo4j 5.x Instance (BillSoft VPS 82.29.164.106)
// =========================================================

// 1. Create Constraints for Unique Public QR and Node IDs
CREATE CONSTRAINT uqis_product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT uqis_customer_id IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT uqis_warehouse_id IF NOT EXISTS FOR (w:Warehouse) REQUIRE w.id IS UNIQUE;
CREATE CONSTRAINT uqis_invoice_id IF NOT EXISTS FOR (i:Invoice) REQUIRE i.id IS UNIQUE;
CREATE CONSTRAINT uqis_qr_public_id IF NOT EXISTS FOR (q:QR) REQUIRE q.publicQrId IS UNIQUE;

// 2. Create Core Nodes & Relationships Blueprint
MERGE (c:Customer {id: "bs-cust-145", name: "Apex Retail Enterprises", publicQrId: "BS-CUST-00000145"})
MERGE (i:Invoice {id: "bs-inv-4001", number: "INV-2026-891", amount: 34220})
MERGE (p:Product {id: "bs-prod-1001", name: "Heavy Duty Thermal POS Printer", sku: "SKU-POS-80MM"})
MERGE (w:Warehouse {id: "bs-wh-01", name: "Central Logistics Hub"})
MERGE (r:RentalAsset {id: "bs-rent-900", name: "Industrial Barcode Scanner Rig"})
MERGE (war:Warranty {id: "bs-war-33", duration: "2 Years"})

// Build Relationships
MERGE (c)-[:PURCHASED]->(i)
MERGE (i)-[:CONTAINS]->(p)
MERGE (p)-[:STORED_IN]->(w)
MERGE (c)-[:RENTED]->(r)
MERGE (c)-[:HAS_WARRANTY]->(war)
MERGE (p)-[:COVERED_BY]->(war);
`;
  }
}

export const billSoftService = new BillSoftService();
