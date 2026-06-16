import React from "react";

import StatusBadge from "@/components/StatusBadge/StatusBadge";
import VerdictBadge from "@/components/UI/VerdictBadge";
import type { Candidate } from "@/types/candidate";
import { Link } from "react-router";

interface Props {
  candidate: Candidate;
  searchParams: string;
}

const CandidateCard = React.memo(function CandidateCard({
  candidate,
  searchParams,
}: Props) {
  const { id, name, city, total_exp, verdict, vc, stack, status } = candidate;

  return (
    <Link
      to={`/candidate/${id}?${searchParams}`}
      className="h-full flex flex-col justify-between items-start p-4 border border-gray-300 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all bg-white"
      aria-label={`Кандидат ${name}`}
    >
      <div className="w-full flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {name}
        </h3>
        <VerdictBadge verdict={verdict} vc={vc} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
        <span>📍 {city}</span>
        <span>⏱ {total_exp}</span>
      </div>

      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{stack}</p>

      <StatusBadge status={status} />
    </Link>
  );
});

export default CandidateCard;
