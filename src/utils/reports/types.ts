
import { SupabaseClient } from '@supabase/supabase-js';

export interface ReportMetric {
  metric: string;
  value: any;
  category: string;
}

export interface OrganizedMetrics {
  [category: string]: ReportMetric[];
}

export interface ReportContent {
  title: string;
  introduction: string;
  summary_analysis: string;
  distinctive_metrics_summary: string;
  detailed_metrics: OrganizedMetrics;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface StrategicRecommendation {
  recommendation_number: number;
  title: string;
  description: string;
  metrics_references?: any[];
}

export interface ReportGenerationResults {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  archetypeIds: string[];
  errors: string[];
}
