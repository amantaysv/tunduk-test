import type {
  Candidate,
  SortDirection,
  SortField,
  VerdictLabel,
} from "@/types/candidate";

export function filterCandidates(
  candidates: Candidate[],
  verdict: VerdictLabel | "Все",
  search: string
): Candidate[] {
  return candidates.filter((c) => {
    const matchesVerdict = verdict === "Все" || c.verdict === verdict;
    const matchesSearch =
      search === "" || c.name.toLowerCase().includes(search.toLowerCase());
    return matchesVerdict && matchesSearch;
  });
}

export function sortCandidates(
  candidates: Candidate[],
  field: SortField,
  direction: SortDirection
): Candidate[] {
  return [...candidates].sort((a, b) => {
    let cmp: number;

    if (field === "total_exp") {
      cmp = parseExpYears(a.total_exp) - parseExpYears(b.total_exp);
    } else {
      cmp = a[field].localeCompare(b[field], "ru");
    }

    return direction === "asc" ? cmp : -cmp;
  });
}

function parseExpYears(exp: string): number {
  const match = exp.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function isMobile(): boolean {
  return window.innerWidth < 768;
}

export const PAGE_SIZE = 10;

export function paginate<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

export function totalPages(count: number): number {
  return Math.ceil(count / PAGE_SIZE);
}
