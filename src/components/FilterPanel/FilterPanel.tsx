import React from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

import type { SortDirection, SortField, VerdictLabel } from "@/types/candidate";

const VERDICT_OPTIONS: Array<VerdictLabel | "Все"> = [
  "Все",
  "ПОДХОДИТ",
  "ЧАСТИЧНО",
  "НЕ СООТВЕТСТВУЕТ",
];

const SORT_OPTIONS: Array<{ value: SortField; label: string }> = [
  { value: "name", label: "По имени" },
  { value: "total_exp", label: "По опыту" },
  { value: "createdAt", label: "По дате" },
];

interface Props {
  verdict: VerdictLabel | "Все";
  sortField: SortField;
  sortDirection: SortDirection;
  onVerdictChange: (v: VerdictLabel | "Все") => void;
  onSortFieldChange: (f: SortField) => void;
  onSortDirectionChange: (d: SortDirection) => void;
}

const FilterPanel = React.memo(function FilterPanel({
  verdict,
  sortField,
  sortDirection,
  onVerdictChange,
  onSortFieldChange,
  onSortDirectionChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <fieldset className="flex gap-1 flex-wrap">
        <legend className="sr-only">Фильтр по вердикту</legend>
        {VERDICT_OPTIONS.map((v) => (
          <button
            key={v}
            onClick={() => onVerdictChange(v)}
            aria-pressed={verdict === v}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors hover:cursor-pointer ${
              verdict === v
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {v}
          </button>
        ))}
      </fieldset>

      <div className="flex items-center gap-2 ml-auto">
        <label
          htmlFor="sort-field"
          className="text-sm text-gray-600 whitespace-nowrap"
        >
          Сортировка:
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
          }
          aria-label={
            sortDirection === "asc" ? "По убыванию" : "По возрастанию"
          }
          className="h-full border border-gray-300 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
        >
          {sortDirection === "asc" ? <IoArrowUp /> : <IoArrowDown />}
        </button>
      </div>
    </div>
  );
});

export default FilterPanel;
