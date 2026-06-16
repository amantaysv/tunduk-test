import toast from "react-hot-toast";

import { patchCandidateStatus } from "@/services/api";
import { useCandidatesStore } from "@/store";
import type { CandidateStatus } from "@/types/candidate";

export function useStatusUpdate() {
  const { updateStatus, rollbackStatus, setUpdatingStatusId } =
    useCandidatesStore();

  async function changeStatus(
    id: string,
    prevStatus: CandidateStatus,
    nextStatus: CandidateStatus
  ) {
    // Оптимистичное обновление
    updateStatus(id, nextStatus);
    setUpdatingStatusId(id);

    try {
      await patchCandidateStatus(id, nextStatus);
      toast.success("Статус обновлён");
    } catch {
      rollbackStatus(id, prevStatus);
      toast.error("Ошибка обновления статуса — изменения отменены");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return { changeStatus };
}
