import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import CandidateCard from "@/components/CandidateCard/CandidateCard";
import CandidateListVirtual from "@/components/CandidateList/CandidateListVirtual";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import SearchBar from "@/components/SearchBar/SearchBar";
import Pagination from "@/components/UI/Pagination";
import { useCandidates } from "@/hooks/useCandidates";
import { useDebounce } from "@/hooks/useDebounce";
import type { SortDirection, SortField, VerdictLabel } from "@/types/candidate";
import {
  PAGE_SIZE,
  filterCandidates,
  paginate,
  sortCandidates,
  totalPages,
} from "@/utils/helpers";

const LARGE_LIST_THRESHOLD = 30;

export default function CandidatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { candidates, loading, error } = useCandidates();

  // Sync state with URL params
  const rawSearch = searchParams.get("search") ?? "";
  const verdict =
    (searchParams.get("verdict") as VerdictLabel | "Все") ?? "Все";
  const sortField = (searchParams.get("sortField") as SortField) ?? "createdAt";
  const sortDirection =
    (searchParams.get("sortDir") as SortDirection) ?? "desc";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [inputSearch, setInputSearch] = useState(rawSearch);
  const debouncedSearch = useDebounce(inputSearch, 300);

  // Sync debounced search to URL (avoid redundant updates)
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set("search", debouncedSearch);
        } else {
          next.delete("search");
        }
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (p: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(p));
        return next;
      });
    },
    [setSearchParams]
  );

  const filtered = useMemo(
    () => filterCandidates(candidates, verdict, debouncedSearch),
    [candidates, verdict, debouncedSearch]
  );

  const sorted = useMemo(
    () => sortCandidates(filtered, sortField, sortDirection),
    [filtered, sortField, sortDirection]
  );

  const pages = totalPages(sorted.length);
  const safePage = Math.min(page, Math.max(1, pages));
  const paginated = useMemo(
    () => paginate(sorted, safePage),
    [sorted, safePage]
  );

  // Container width for virtualization
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const useVirtual = sorted.length > LARGE_LIST_THRESHOLD;
  const currentSearchString = searchParams.toString();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <span className="sr-only">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16" role="alert">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Кандидаты</h1>
        <p className="text-sm text-gray-500">
          {sorted.length} из {candidates.length} кандидатов
        </p>
      </header>

      <div className="space-y-4 mb-6">
        <SearchBar value={inputSearch} onChange={setInputSearch} />
        <FilterPanel
          verdict={verdict}
          sortField={sortField}
          sortDirection={sortDirection}
          onVerdictChange={(v) => setParam("verdict", v)}
          onSortFieldChange={(f) => setParam("sortField", f)}
          onSortDirectionChange={(d) => setParam("sortDir", d)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Кандидаты не найдены</p>
          <p className="text-sm mt-1">
            Попробуйте изменить фильтры или поисковый запрос
          </p>
        </div>
      ) : useVirtual ? (
        <div ref={containerRef} className="flex justify-center">
          <CandidateListVirtual
            candidates={sorted}
            searchParams={currentSearchString}
            containerWidth={containerWidth}
          />
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {paginated.map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                searchParams={currentSearchString}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Показано {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, sorted.length)} из {sorted.length}
            </p>
            <Pagination page={safePage} total={pages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
