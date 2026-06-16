import React from "react";

import { useStatusUpdate } from "@/hooks/useStatusUpdate";
import { useCandidatesStore } from "@/store";
import type { CandidateStatus } from "@/types/candidate";

const STATUS_OPTIONS: Array<{ value: CandidateStatus; label: string }> = [
  { value: "new", label: "Новый" },
  { value: "review", label: "На рассмотрении" },
  { value: "invited", label: "Приглашён" },
  { value: "rejected", label: "Отклонён" },
];

interface Props {
  candidateId: string;
  currentStatus: CandidateStatus;
}

function StatusSelect({ candidateId, currentStatus }: Props) {
  const { changeStatus } = useStatusUpdate();
  const updatingStatusId = useCandidatesStore((s) => s.updatingStatusId);
  const isUpdating = updatingStatusId === candidateId;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as CandidateStatus;
    if (next !== currentStatus) {
      changeStatus(candidateId, currentStatus, next);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={`status-${candidateId}`}
        className="text-sm font-medium text-gray-700"
      >
        Статус:
      </label>
      <div className="relative">
        <select
          id={`status-${candidateId}`}
          value={currentStatus}
          onChange={handleChange}
          disabled={isUpdating}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed pr-8"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {isUpdating && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatusSelect;
