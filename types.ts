
export enum EventCategory {
  DIPLOMATIC = 'DIPLOMATIC',
  MILITARY = 'MILITARY',
  PUBLIC_OPINION = 'PUBLIC_OPINION'
}

export interface TimelineEvent {
  date: string;
  title: string;
  summary: string;
  category: EventCategory;
}

export interface RiskSubFactor {
  name: string;
  score: number; // 0-10
  description: string;
}

export interface RiskIndexData {
  totalScore: number; // The final calculated score
  riskLevel: string; // e.g., "HIGH", "CRITICAL"
  riskMultiplier: {
    value: number;
    reason: string;
  };
  indices: {
    taiwanStrait: number; // I_TS
    eastChinaSea: number; // I_ECS
    sinoUsRelation: number; // I_SUR
    internalPolitics: number; // I_IPS
    thirdParty: number; // I_TPI
  };
  drivers: string[]; // HTML list items
  mitigators: string[]; // HTML list items
}

export interface AnalysisData {
  timeline: TimelineEvent[];
  conflictIndex: RiskIndexData;
  impulseAnalysis: string;
  impulseProbability: number; // 0-100
  strategicAnalysis: string;
  futurePrediction: string;
  surpriseAttackAnalysis: string;
  potentialTargets: string[];
  sources?: { title: string; uri: string }[];
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}
