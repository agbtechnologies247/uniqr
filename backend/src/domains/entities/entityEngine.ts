export interface EntityField {
  id: string;
  name: string;
  type: string;
  value: any;
  category?: 'Basic' | 'Warranty' | 'Maintenance' | 'Compliance' | 'Custom';
}

export interface EntityRecord {
  id: string;
  entityType: 'Product' | 'Machine' | 'Vehicle' | 'Building' | 'Invoice' | 'Asset' | 'Equipment';
  tenantId: string;
  name: string;
  currentState: string;
  assignedQrCode?: string;
  customFields: Record<string, any>;
  fields: EntityField[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export class EntityEngine {
  private entities: Map<string, EntityRecord> = new Map();

  createEntity(entity: EntityRecord): EntityRecord {
    this.entities.set(entity.id, entity);
    return entity;
  }

  getEntity(id: string): EntityRecord | undefined {
    return this.entities.get(id);
  }

  getAllEntities(): EntityRecord[] {
    return Array.from(this.entities.values());
  }

  updateEntityState(id: string, newState: string): EntityRecord | undefined {
    const existing = this.entities.get(id);
    if (existing) {
      existing.currentState = newState;
      existing.updatedAt = new Date().toISOString();
      this.entities.set(id, existing);
    }
    return existing;
  }
}

export const entityEngine = new EntityEngine();
