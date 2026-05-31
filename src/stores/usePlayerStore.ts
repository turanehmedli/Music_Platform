import { create } from "zustand";
import type { Track } from "../types/track";

const BASE_URL = "https://discoveryprovider.audius.co/v1";

interface PlayerState {
  track: Track | null;
  playing: boolean;
  progress: number;
  duration: number;
  audio: HTMLAudioElement | null;
  play: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setProgress: (t: number) => void;
  setDuration: (t: number) => void;
  setPlaying: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  track: null,
  playing: false,
  progress: 0,
  duration: 0,
  audio: null,

  play: (track) => {
    const prev = get().audio;
    if (prev) {
      prev.pause();
      prev.src = "";
    }

    const audio = new Audio(`${BASE_URL}/tracks/${track.id}/stream`);

    audio.ontimeupdate = () => set({ progress: audio.currentTime });
    audio.onloadedmetadata = () => set({ duration: audio.duration });
    audio.onended = () => set({ playing: false });

    audio.play();
    set({ track, audio, playing: true, progress: 0, duration: 0 });
  },

  togglePlayPause: () => {
    const { audio, playing } = get();
    if (!audio) return;
    if (playing) {
      audio.pause();
      set({ playing: false });
    } else {
      audio.play();
      set({ playing: true });
    }
  },

  seek: (time) => {
    const { audio } = get();
    if (!audio) return;
    audio.currentTime = time;
    set({ progress: time });
  },

  setProgress: (t) => set({ progress: t }),
  setDuration: (t) => set({ duration: t }),
  setPlaying: (v) => set({ playing: v }),
}));