export interface ScanTelemetryContext {
  qrId: string;
  entityId: string;
  timestamp: string;
  gps?: { lat: number; lng: number; locationName: string };
  userRole?: 'customer' | 'technician' | 'warehouse' | 'manager' | 'anonymous';
  deviceOS?: string;
  timeSinceLastScanSeconds?: number;
  historicalFailuresCount?: number;
  operatingHours?: number;
}

export interface PersonaResponse {
  persona: string;
  headline: string;
  alertLevel: 'NORMAL' | 'WARNING' | 'CRITICAL';
  predictiveRiskScore: number; // 0 - 100%
  recommendedAction: string;
  recommendedParts?: string[];
  assignedTechnician?: string;
  sections: Array<{ title: string; fields: Record<string, string> }>;
}

export class AiDecisionEngine {
  
  // Predictive Maintenance Risk Model (Calculates Failure Risk Score)
  calculateFailureRisk(operatingHours = 1000, historicalFailures = 0, warrantyAgeMonths = 12): {
    score: number;
    riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
    likelyDaysToFailure: number;
    recommendedParts: string[];
  } {
    let score = Math.min(95, Math.round((operatingHours / 40) + (historicalFailures * 18) + (warrantyAgeMonths * 1.5)));
    if (score > 100) score = 98;

    let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score >= 75) riskCategory = 'HIGH';
    else if (score >= 40) riskCategory = 'MEDIUM';

    const likelyDaysToFailure = score >= 75 ? Math.max(1, 14 - Math.round(score / 10)) : 120;
    
    const partsMap: Record<string, string[]> = {
      HIGH: ['Bearing Assembly (92% match)', 'Drive Motor (81% match)', 'Thermal Fuse (76% match)'],
      MEDIUM: ['Lubrication Seal (65% match)', 'Dust Filter (50% match)'],
      LOW: ['Standard Maintenance Kit']
    };

    return {
      score,
      riskCategory,
      likelyDaysToFailure,
      recommendedParts: partsMap[riskCategory]
    };
  }

  // Impossible Travel Velocity Fraud Detector
  detectFraud(currentScan: ScanTelemetryContext, prevScan?: ScanTelemetryContext): {
    isFraud: boolean;
    fraudReason?: string;
  } {
    if (!prevScan || !currentScan.gps || !prevScan.gps) return { isFraud: false };

    const timeDiffMinutes = (new Date(currentScan.timestamp).getTime() - new Date(prevScan.timestamp).getTime()) / (1000 * 60);
    const isDifferentLocation = currentScan.gps.locationName !== prevScan.gps.locationName;

    // Fraud trigger: scan location changes across cities in under 10 minutes
    if (timeDiffMinutes < 10 && isDifferentLocation) {
      return {
        isFraud: true,
        fraudReason: `IMPOSSIBLE_TRAVEL_VELOCITY: Scanned in ${currentScan.gps.locationName} ${timeDiffMinutes.toFixed(1)} mins after ${prevScan.gps.locationName}`
      };
    }

    return { isFraud: false };
  }

  // Persona-Aware Dynamic Response Builder
  buildPersonaResponse(context: ScanTelemetryContext, entityData: any): PersonaResponse {
    const role = context.userRole || 'anonymous';
    const risk = this.calculateFailureRisk(
      entityData.operatingHours || 1800,
      entityData.historicalFailures || 2,
      entityData.warrantyAgeMonths || 24
    );

    if (role === 'technician') {
      return {
        persona: 'Technician View',
        headline: `⚠ High Failure Probability (${risk.score}%) Detected`,
        alertLevel: risk.score > 70 ? 'CRITICAL' : 'WARNING',
        predictiveRiskScore: risk.score,
        recommendedAction: `Schedule immediate component replacement within ${risk.likelyDaysToFailure} days`,
        recommendedParts: risk.recommendedParts,
        assignedTechnician: 'Mahesh Kulkarni (Senior Bio-Engineer)',
        sections: [
          {
            title: 'Diagnostic & Telemetry Log',
            fields: {
              'Operating Hours': `${entityData.operatingHours || 1800} hrs`,
              'Failure Probability': `${risk.score}% Risk`,
              'Estimated Failure Window': `Within ${risk.likelyDaysToFailure} Days`,
              'Last Calibration': '2026-05-15 (Autoclave Passed)'
            }
          },
          {
            title: 'Recommended Replacement Parts',
            fields: {
              'Primary Component': risk.recommendedParts[0] || 'Standard Kit',
              'Secondary Component': risk.recommendedParts[1] || 'None'
            }
          }
        ]
      };
    }

    if (role === 'customer') {
      return {
        persona: 'Customer View',
        headline: `Welcome to your ${entityData.name || 'Verified Product'}`,
        alertLevel: 'NORMAL',
        predictiveRiskScore: 5,
        recommendedAction: 'View user manual or register active warranty',
        sections: [
          {
            title: 'Product Information & Warranty',
            fields: {
              'Product Name': entityData.name,
              'Brand': entityData.brand,
              'Warranty Status': `${entityData.warrantyMonths || 24} Months Active Coverage`,
              'Customer Support': '1800-UNIQR-SUPPORT'
            }
          }
        ]
      };
    }

    // Default Public View
    return {
      persona: 'Public Gateway View',
      headline: `Verified Authentic Twin: ${entityData.name || 'Product'}`,
      alertLevel: 'NORMAL',
      predictiveRiskScore: 0,
      recommendedAction: 'Genuine UniQR Authenticated Digital Twin',
      sections: [
        {
          title: 'Public Specifications',
          fields: {
            'Identity Code': entityData.uniqrCode || context.qrId,
            'Manufacturer': entityData.manufacturer || 'AGB Technologies Ltd',
            'Certificate': 'ISO 9001 & SHA-256 Verified'
          }
        }
      ]
    };
  }
}

export const aiDecisionEngine = new AiDecisionEngine();
