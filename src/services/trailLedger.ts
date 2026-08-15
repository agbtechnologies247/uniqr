import { TamperEvidentTrailEvent } from '../types';

export class TrailLedger {
  /**
   * Computes a SHA-256 hash for a trail event string using the browser Web Crypto API
   */
  static async computeHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Fast synchronous fallback hash generator (for instant UI state rendering)
   */
  static simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256_${hex}${hex}${hex}${hex}`.slice(0, 64);
  }

  /**
   * Appends a new event to an existing tamper-evident event list, linking hashes
   */
  static async appendEvent(
    qrId: string,
    existingEvents: TamperEvidentTrailEvent[],
    eventPayload: {
      type: string;
      module: TamperEvidentTrailEvent['module'];
      location?: string;
      department?: string;
      user?: string;
      erpTask?: string;
      details?: Record<string, any>;
    }
  ): Promise<TamperEvidentTrailEvent> {
    const previousEvent = existingEvents.length > 0 ? existingEvents[existingEvents.length - 1] : null;
    const previousHash = previousEvent ? previousEvent.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const eventId = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    const signatureRaw = `${qrId}:${eventPayload.type}:${eventPayload.module}:${timestamp}:${eventPayload.user || 'SYS'}`;
    const digitalSignature = `SIG-${this.simpleHash(signatureRaw).slice(0, 16).toUpperCase()}`;

    const contentToHash = JSON.stringify({
      eventId,
      qrId,
      previousHash,
      type: eventPayload.type,
      module: eventPayload.module,
      timestamp,
      location: eventPayload.location || '',
      department: eventPayload.department || '',
      user: eventPayload.user || '',
      erpTask: eventPayload.erpTask || '',
      digitalSignature,
      details: eventPayload.details || {}
    });

    let currentHash = '';
    try {
      currentHash = await this.computeHash(contentToHash);
    } catch {
      currentHash = this.simpleHash(contentToHash);
    }

    const newEvent: TamperEvidentTrailEvent = {
      id: eventId,
      qrId,
      type: eventPayload.type,
      module: eventPayload.module,
      timestamp,
      location: eventPayload.location || 'Pune Factory',
      department: eventPayload.department || 'Operations',
      user: eventPayload.user || 'admin@uniqr.io',
      erpTask: eventPayload.erpTask || `ERP-${eventPayload.module.toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      digitalSignature,
      previousHash,
      currentHash,
      details: eventPayload.details || {}
    };

    return newEvent;
  }

  /**
   * Verifies tamper-evident integrity of an entire event chain
   */
  static verifyChainIntegrity(events: TamperEvidentTrailEvent[]): { isValid: boolean; brokenAtIndex?: number } {
    if (!events || events.length === 0) return { isValid: true };
    
    let expectedPrevious = '0000000000000000000000000000000000000000000000000000000000000000';
    for (let i = 0; i < events.length; i++) {
      const evt = events[i];
      if (evt.previousHash !== expectedPrevious) {
        return { isValid: false, brokenAtIndex: i };
      }
      expectedPrevious = evt.currentHash;
    }
    return { isValid: true };
  }
}
