
export interface Evidence {
  page: number;
  text: string;
  score: number;
  section: string | null;
  semantic_score?: number;
  keyword_score?: number;
}

export interface AnalysisItem {
  category: string;
  status: string;
  confidence: string | null;
  page: number | null;
  section: string | null;
  evidence: string | null;
  score: number | null;
  alternatives: Evidence[];
}

export interface AnalysisSummary {
  total_categories: number;
  applicable_categories: number;
  found: number;
  partial: number;
  missing: number;
  not_applicable: number;
  evidence_coverage: number;
}

export interface AnalysisResponse {
  id: string;
  filename: string;
  pages: number;
  chunks: number;
  categories: AnalysisItem[];
  summary: AnalysisSummary;
  evidence_gaps: string[];
}

export interface AskResponse {
  question: string;
  answer: string;
  evidence: Evidence[];
}

