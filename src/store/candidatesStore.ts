import type { Candidate, CandidateStatus } from "@/types/candidate";
import { create } from "zustand";

interface CandidatesStore {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  updatingStatusId: string | null;
  setCandidates: (candidates: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateStatus: (id: string, status: CandidateStatus) => void;
  rollbackStatus: (id: string, prevStatus: CandidateStatus) => void;
  setUpdatingStatusId: (id: string | null) => void;
}

export const useCandidatesStore = create<CandidatesStore>((set) => ({
  candidates: [],
  loading: false,
  error: null,
  updatingStatusId: null,

  setCandidates: (candidates) => set({ candidates }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUpdatingStatusId: (id) => set({ updatingStatusId: id }),

  updateStatus: (id, status) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    })),

  rollbackStatus: (id, prevStatus) =>
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === id ? { ...c, status: prevStatus } : c
      ),
    })),
}));
