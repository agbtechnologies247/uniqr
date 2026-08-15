import { EventEmitter } from 'events';

export type EventType =
  | 'QR_CREATED'
  | 'QR_UPDATED'
  | 'QR_SCANNED'
  | 'ENTITY_CREATED'
  | 'ENTITY_UPDATED'
  | 'FIELD_CHANGED'
  | 'TRAIL_ADDED'
  | 'RELATIONSHIP_ADDED'
  | 'WORKFLOW_STARTED'
  | 'RISK_THRESHOLD_EXCEEDED'
  | 'FRAUD_DETECTED';

export interface SystemEvent {
  id: string;
  type: EventType;
  entityId?: string;
  qrCode?: string;
  tenantId: string;
  timestamp: string;
  actor: {
    userId?: string;
    role?: string;
    ip?: string;
  };
  payload: Record<string, any>;
}

class EventBusService extends EventEmitter {
  private eventLog: SystemEvent[] = [];

  publish(event: SystemEvent): void {
    this.eventLog.unshift(event);
    console.log(`⚡ [EVENT_BUS] Published ${event.type} for Entity/QR: ${event.entityId || event.qrCode}`);
    this.emit(event.type, event);
    this.emit('*', event);
  }

  getEventHistory(limit = 50): SystemEvent[] {
    return this.eventLog.slice(0, limit);
  }
}

export const eventBus = new EventBusService();
