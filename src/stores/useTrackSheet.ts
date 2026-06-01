import { create } from "zustand";

interface TrackSheetState {
  isOpen: boolean;
  trackId: string | null;
  openSheet: (id: string) => void;
  closeSheet: () => void;
}

export const useTrackSheet = create<TrackSheetState>((set) => ({
  isOpen: false,
  trackId: null,
  openSheet: (id) => set({ isOpen: true, trackId: id }),
  closeSheet: () => set({ isOpen: false, trackId: null }),
}));