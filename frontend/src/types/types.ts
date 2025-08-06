export interface UiMessage {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;

  analysisData?: AnalysisData;
}

export interface AnalysisData {
  type: string;

  totalResults?: number;
  riskLevel?: "HIGH" | "MEDIUM" | "LOW";

  topPatents?: PatentSearchResult[];
  recommendedActions?: string[];
  bypassStrategies?: BypassStrategy[];
}

export interface PatentSearchResult {
  inventionTitle: string;
  applicantName: string;
  applicationNumber: string;
  applicationDate: string;
  registerStatus: string;
  similarity?: number;
}

export interface BypassStrategy {
  type: string;
  description: string;
  feasibility: number;  // 0 ~ 100
  timeline: string;
}

export interface PatentResult {
  id: number;
  title: string;
  applicationNumber: string;
  status: "등록" | "출원" | "심사중" | "거절" | "포기" | string;
  summary: string;
  link: string;
  applicant?: string;
  filingDate?: string;
  category?: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  results: PatentResult[];
}

export interface BookmarkItem {
  id: string;
  title: string;
  type: 'patent' | 'analysis';
  content: string;
  timestamp: Date;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export interface AnalysisHistory {
  id: string;
  title: string;
  type: 'summary' | 'similarity' | 'infringement';
  content: string;
  timestamp: Date;
}

export type TabType = "new-analysis" | "analysis-history" | "analysis-tools" | "workspace";
export type AnalysisToolType = "summary" | "similarity" | "infringement";