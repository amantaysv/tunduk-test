import type { Candidate, CandidateStatus } from "@/types/candidate";

import { candidatesLargeData } from "./mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCandidates(): Promise<Candidate[]> {
  await delay(300);
  return candidatesLargeData;
}

export async function patchCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<void> {
  await delay(600);
  // Симулируем случайную ошибку ~15% запросов для демонстрации rollback
  if (Math.random() < 0.15) {
    throw new Error(`Ошибка при обновлении статуса кандидата ${id}`);
  }
  // В реальном приложении: PATCH /api/candidates/:id/status
  console.log(`PATCH /api/candidates/${id}/status`, { status });
}
