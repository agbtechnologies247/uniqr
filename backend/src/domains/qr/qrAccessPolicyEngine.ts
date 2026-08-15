import { redisClient } from '../db/redisClient.js';

export type VisibilityPolicy = 
  | 'PUBLIC' 
  | 'PRIVATE' 
  | 'AUTHENTICATED' 
  | 'PASSWORD' 
  | 'TIME_LIMITED' 
  | 'LOCATION_RESTRICTED';

export interface QrPolicyEvaluationResult {
  isAccessPermitted: boolean;
  publicSlug: string;
  policy: VisibilityPolicy;
  scanSessionId: string;
  permittedDataFields: string[];
  restrictedFields?: string[];
  challengeRequired?: 'LOGIN_REQUIRED' | 'PASSWORD_REQUIRED' | 'LOCATION_DENIED';
}

class QrAccessPolicyEngine {
  public evaluateAccess(
    slug: string,
    policy: VisibilityPolicy,
    isUserAuthenticated: boolean,
    clientIp: string,
    userAgent: string
  ): QrPolicyEvaluationResult {
    // 1. Issue 30-minute anonymous scan session cookie
    const scanSessionId = redisClient.createPublicScanSession(slug, clientIp, userAgent);

    // 2. Evaluate Policy Matrix
    if (policy === 'AUTHENTICATED' && !isUserAuthenticated) {
      return {
        isAccessPermitted: false,
        publicSlug: slug,
        policy,
        scanSessionId,
        permittedDataFields: ['name', 'category', 'manufacturer'],
        restrictedFields: ['serialNumber', 'customFields', 'trailEvents', 'warrantyMonths'],
        challengeRequired: 'LOGIN_REQUIRED'
      };
    }

    // Default Public Access
    return {
      isAccessPermitted: true,
      publicSlug: slug,
      policy,
      scanSessionId,
      permittedDataFields: ['ALL']
    };
  }
}

export const qrAccessPolicyEngine = new QrAccessPolicyEngine();
