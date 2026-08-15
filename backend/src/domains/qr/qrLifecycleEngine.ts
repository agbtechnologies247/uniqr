export type QrStatus =
  | 'RESERVED'
  | 'ACTIVE'
  | 'REPLACED'
  | 'MERGED'
  | 'CLONED'
  | 'TRANSFERRED'
  | 'ARCHIVED'
  | 'EXPIRED'
  | 'RECOVERED'
  | 'DESTROYED';

export interface QrIdentityRecord {
  qrId: string;
  publicToken: string;
  internalUuid: string;
  status: QrStatus;
  version: number;
  checksum: string;
  ownerTenantId: string;
  targetEntityId: string;
  createdDate: string;
  lastScanDate?: string;
  replacedByQrId?: string;
}

export class QrLifecycleEngine {
  private qrRecords: Map<string, QrIdentityRecord> = new Map();

  registerQr(record: QrIdentityRecord): QrIdentityRecord {
    this.qrRecords.set(record.qrId, record);
    this.qrRecords.set(record.publicToken, record);
    return record;
  }

  resolveToken(token: string): QrIdentityRecord | undefined {
    return this.qrRecords.get(token);
  }

  transitionState(qrId: string, newStatus: QrStatus, payload?: { replacedBy?: string }): QrIdentityRecord | undefined {
    const record = this.qrRecords.get(qrId);
    if (record) {
      record.status = newStatus;
      record.version += 1;
      if (payload?.replacedBy) record.replacedByQrId = payload.replacedBy;
      this.qrRecords.set(qrId, record);
    }
    return record;
  }
}

export const qrLifecycleEngine = new QrLifecycleEngine();
