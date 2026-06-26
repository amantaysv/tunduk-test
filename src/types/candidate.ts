export type VerdictCode = "verdict-green" | "verdict-orange" | "verdict-red";
export type VerdictLabel = "ПОДХОДИТ" | "ЧАСТИЧНО" | "НЕ СООТВЕТСТВУЕТ";
export type CriteriaStatus = "ok" | "partial" | "no";
export type CandidateStatus = "new" | "review" | "invited" | "rejected";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  pos_label: string;
  file?: string;
  email: string;
  phone: string;
  city: string;
  tg: string;
  exp: [string, string, string, string][];
  total_exp: string;
  stack: string;
  edu: string;
  verdict: VerdictLabel;
  vc: VerdictCode;
  criteria: [CriteriaStatus, string][];
  summary: string;
  questions: string[];
  status: CandidateStatus;
  createdAt: string;
}

export type SortField = "name" | "total_exp" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  verdict: VerdictLabel | "Все";
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
}
