import React from "react";

import type { VerdictCode, VerdictLabel } from "@/types/candidate";

const VC_CLASS: Record<VerdictCode, string> = {
  "verdict-green": "bg-green-100 text-green-800 border border-green-300",
  "verdict-orange": "bg-orange-100 text-orange-800 border border-orange-300",
  "verdict-red": "bg-red-100 text-red-800 border border-red-300",
};

interface Props {
  verdict: VerdictLabel;
  vc: VerdictCode;
  size?: "sm" | "md";
}

const VerdictBadge = React.memo(function VerdictBadge({
  verdict,
  vc,
  size = "sm",
}: Props) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-block rounded-full font-medium whitespace-nowrap ${sizeClass} ${VC_CLASS[vc]}`}
    >
      {verdict}
    </span>
  );
});

export default VerdictBadge;
