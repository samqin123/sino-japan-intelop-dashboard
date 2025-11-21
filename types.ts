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

export interface AnalysisData {
  timeline: TimelineEvent[];
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