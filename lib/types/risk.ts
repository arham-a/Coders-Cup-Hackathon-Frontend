// src/types/risk.ts
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface RiskProfile {
  userId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReasons: string[];
  recommendedMaxLoan?: number;
  recommendedTenure?: number;
  defaultProbability?: number;
  lastCalculated: string;
}
