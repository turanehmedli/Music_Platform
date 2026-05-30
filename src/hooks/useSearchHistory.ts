import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchHistoryStore = {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
};

export const useSearchHistory = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const updated = [
          trimmed,
          ...get().history.filter((h) => h !== trimmed),
        ].slice(0, 10);
        set({ history: updated });
      },

      removeFromHistory: (query) => {
        set({ history: get().history.filter((h) => h !== query) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    { name: "search_history" } 
  )
);