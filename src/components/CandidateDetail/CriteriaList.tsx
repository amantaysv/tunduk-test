import type { ReactNode } from "react";
import { IoCheckmark } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { LuCircleDashed } from "react-icons/lu";

import type { CriteriaStatus } from "@/types/candidate";

const CRITERIA_CONFIG: Record<
  CriteriaStatus,
  { icon: ReactNode; className: string; label: string }
> = {
  ok: {
    icon: <IoCheckmark />,
    className: "text-green-700 bg-green-50 border-green-200",
    label: "Соответствует",
  },
  partial: {
    icon: <LuCircleDashed />,
    className: "text-orange-700 bg-orange-50 border-orange-200",
    label: "Частично",
  },
  no: {
    icon: <IoClose />,
    className: "text-red-700 bg-red-50 border-red-200",
    label: "Отсутствует",
  },
};

interface Props {
  criteria: [CriteriaStatus, string][];
}

function CriteriaList({ criteria }: Props) {
  return (
    <ul className="space-y-2">
      {criteria.map(([status, text], i) => {
        const { icon, className, label } = CRITERIA_CONFIG[status];
        return (
          <li
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg border ${className}`}
          >
            <span className="shrink-0" aria-label={label}>
              {icon}
            </span>
            <span className="text-sm">{text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default CriteriaList;
