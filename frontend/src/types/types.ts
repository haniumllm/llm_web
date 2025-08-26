// API 응답 구조
export interface ApiResponse {
  response: string;
  results?: AnalysisData;
  session_id?: string;
  analysis_type?: string;
}

// 발신자 타입
export type Sender = "user" | "bot";

// 특허 중복 위험도
export type RiskLevel = "HIGH" | "MEDIUM" | 'LOW';

// 사이드 패널 탭 타입
export type TabType = "analysis-history" | "analysis-tools" | "workspace";

// 분석 도구 타입
export type AnalysisToolType = "summary" | "similarity" | "infringement";

// 메시지 구조 (유저, 봇)
export interface UiMessage {
  sender: Sender; // 발신자
  text: string; // 사용자 입력 | 봇 응답 raw 텍스트
  timestamp: Date; // 전송 시간
  analysisData?: AnalysisData; // 선택적으로 분석 데이터 포함
}

// 분석 요약 데이터 구조
export interface AnalysisData {
  type: string; // 분석 유형
  totalResults: number; // 총 검색 결과 수
  topPatents?: PatentSearchResult[]; // 대표 유사 특허 목록
  riskLevel?: RiskLevel; // 위험도(분석 결과)
  recommendedActions?: string[]; // 권장 조치사항
  patentSearchResult?: PatentSearchResult;
  conflictClaims?: number[];         // 충돌 가능성이 있는 청구항 번호 목록
  bypassStrategies?: BypassStrategy[]; // 우회 전략 목록(특허 회피 방법 제안)
}


// 📄 상세 특허 정보 구조 (KIPRIS API 응답 기반 + 분석 확장 필드 포함)
export interface PatentSearchResult {
  applicantName: string;             // 출원인 (발명을 출원한 개인, 기관, 회사명)
  applicationDate: string;           // 출원일 (YYYYMMDD, 특허청에 제출한 날짜)
  applicationNumber: string;         // 출원번호 (특허청이 부여한 고유 번호)
  astrtCont: string;                  // 발명 요약 (초록, 발명의 목적/구성/효과 간략 설명)
  bigDrawing?: string;                // 대표 도면 (큰 이미지) URL
  drawing?: string;                   // 대표 도면 (썸네일) URL
  indexNo?: string;                   // 검색 결과 인덱스 번호 (API 응답에서 제공)
  inventionTitle: string;             // 발명의 명칭
  ipcNumber: string;                  // 국제특허분류(IPC) 코드 (기술 분야 분류, 다중 가능)
  openDate: string;                    // 공개일 (YYYYMMDD, 발명이 공개된 날짜)
  openNumber?: string | null;          // 공개번호 (공개공보의 고유 번호, 없으면 null)
  publicationDate?: string | null;     // 공표일 (일부 국가에서 사용, 없으면 null)
  publicationNumber?: string | null;   // 공표번호 (공표공보의 번호, 없으면 null)
  registerStatus: string;              // 등록 상태 (예: "출원", "공개", "등록", "거절" 등)
  registerNumber?: string | null;      // 등록번호 (등록된 경우 부여되는 번호, 없으면 null)
  similarity?: number;                 // 유사도 점수 (0~1, 분석 결과에 따라 추가)
}


// 개별 우회 전략 구조
export interface BypassStrategy {
  type: string;
  description: string;
  feasibility: number; // 0 ~ 100 (%)
  timeline: string;    // 예상 소요 기간
}

// 분석 기록 구조
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  results: PatentSearchResult[];
  riskLevel: RiskLevel;
  analysisType: string;
}

// 북마크 구조
export interface BookmarkItem {
  id: string;
  title: string;
  type: 'patent' | 'analysis';
  content: string;
  timestamp: Date;
}

// 노트 구조
export interface NoteItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}