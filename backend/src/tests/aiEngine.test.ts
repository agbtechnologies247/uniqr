import { describe, it, expect } from 'vitest';
import { aiDecisionEngine } from '../domains/ai/aiDecisionEngine.js';

describe('AiDecisionEngine', () => {
  it('calculates failure risk score based on operating hours and warranty', () => {
    const risk = aiDecisionEngine.calculateFailureRisk(5000, 2, 24);
    expect(risk).toHaveProperty('score');
    expect(risk).toHaveProperty('likelyDaysToFailure');
    expect(risk).toHaveProperty('recommendedParts');
    expect(typeof risk.score).toBe('number');
    expect(risk.score).toBeGreaterThanOrEqual(0);
    expect(risk.score).toBeLessThanOrEqual(100);
  });

  it('detects fraud for impossible travel between scan locations', () => {
    const prevScan = {
      qrId: 'UQR-PROD-000001',
      entityId: 'prod-101',
      timestamp: '2026-08-14T10:00:00Z',
      gps: { lat: 18.52, lng: 73.85, locationName: 'Pune, India' }
    };
    const currentScan = {
      qrId: 'UQR-PROD-000001',
      entityId: 'prod-101',
      timestamp: '2026-08-14T10:05:00Z',
      gps: { lat: 51.50, lng: -0.12, locationName: 'London, UK' }
    };

    const fraud = aiDecisionEngine.detectFraud(currentScan, prevScan);
    expect(fraud).toHaveProperty('isFraud');
  });

  it('builds persona-aware dynamic response for end consumer vs technician', () => {
    const context = {
      qrId: 'UQR-PROD-000001',
      entityId: 'prod-101',
      timestamp: new Date().toISOString(),
      userRole: 'customer' as const
    };
    const entityData = {
      operatingHours: 1200,
      lastFailureDays: 300,
      warrantyMonths: 24,
      productName: 'AGB HydroMax 500'
    };

    const response = aiDecisionEngine.buildPersonaResponse(context, entityData);
    expect(response).toHaveProperty('persona');
    expect(response).toHaveProperty('headline');
    expect(response).toHaveProperty('alertLevel');
    expect(response).toHaveProperty('predictiveRiskScore');
  });
});
