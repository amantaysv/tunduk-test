import { useMemo } from "react";
import { Grid } from "react-window";
import type { CellComponentProps } from "react-window";

import CandidateCard from "@/components/CandidateCard/CandidateCard";
import type { Candidate } from "@/types/candidate";

const CARD_HEIGHT = 165;
const CARD_WIDTH_MIN = 320;
const GAP = 16;
const VISIBLE_ROWS = 5;

type CellData = {
  candidates: Candidate[];
  searchParams: string;
  colCount: number;
  colWidth: number;
};

function Cell({
  columnIndex,
  rowIndex,
  style,
  candidates,
  searchParams,
  colCount,
  colWidth,
}: CellComponentProps<CellData>) {
  const idx = rowIndex * colCount + columnIndex;
  if (idx >= candidates.length) return null;

  return (
    <div
      style={{
        ...style,
        left: Number(style.left),
        width: colWidth,
        height: CARD_HEIGHT,
      }}
    >
      <CandidateCard candidate={candidates[idx]} searchParams={searchParams} />
    </div>
  );
}

interface Props {
  candidates: Candidate[];
  searchParams: string;
  containerWidth: number;
}

export default function CandidateListVirtual({
  candidates,
  searchParams,
  containerWidth,
}: Props) {
  const colCount = useMemo(
    () =>
      Math.max(1, Math.floor((containerWidth + GAP) / (CARD_WIDTH_MIN + GAP))),
    [containerWidth]
  );
  const rowCount = Math.ceil(candidates.length / colCount);
  const colWidth = Math.floor((containerWidth - GAP * colCount) / colCount);

  const cellProps = useMemo<CellData>(
    () => ({ candidates, searchParams, colCount, colWidth }),
    [candidates, searchParams, colCount, colWidth]
  );

  return (
    <Grid
      columnCount={colCount}
      columnWidth={colWidth + GAP}
      rowCount={rowCount}
      rowHeight={CARD_HEIGHT + GAP}
      cellComponent={Cell}
      cellProps={cellProps}
      style={{ height: VISIBLE_ROWS * (CARD_HEIGHT + GAP) }}
    />
  );
}
