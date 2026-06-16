import { useEffect } from "react";

import { fetchCandidates } from "@/services/api";
import { useCandidatesStore } from "@/store";

export function useCandidates() {
  const { candidates, loading, error, setCandidates, setLoading, setError } =
    useCandidatesStore();

  useEffect(() => {
    if (candidates.length > 0) return;
    setLoading(true);
    fetchCandidates()
      .then(setCandidates)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Ошибка загрузки")
      )
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { candidates, loading, error };
}
