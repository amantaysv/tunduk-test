import React from "react";

import type { CandidateStatus } from "@/types/candidate";

const STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; className: string }
> = {
  new: { label: "Новый", className: "bg-gray-100 text-gray-700" },
  review: { label: "На рассмотрении", className: "bg-blue-100 text-blue-700" },
  invited: { label: "Приглашён", className: "bg-green-100 text-green-700" },
  rejected: { label: "Отклонён", className: "bg-red-100 text-red-700" },
};

interface Props {
  status: CandidateStatus;
}

const StatusBadge = React.memo(function StatusBadge({ status }: Props) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
});

export default StatusBadge;
