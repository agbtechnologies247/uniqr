export interface GraphRelationship {
  id: string;
  sourceId: string;
  sourceType: string;
  targetId: string;
  targetType: string;
  relation: 'owns' | 'installed_at' | 'maintained_by' | 'contains' | 'works_for' | 'CREATED';
  metadata?: Record<string, any>;
}

export class RelationshipEngine {
  private links: GraphRelationship[] = [];

  addRelationship(link: GraphRelationship): GraphRelationship {
    this.links.push(link);
    return link;
  }

  getRelationshipsForNode(nodeId: string): GraphRelationship[] {
    return this.links.filter(l => l.sourceId === nodeId || l.targetId === nodeId);
  }

  getAllRelationships(): GraphRelationship[] {
    return this.links;
  }
}

export const relationshipEngine = new RelationshipEngine();
