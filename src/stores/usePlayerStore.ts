import { create } from "zustand";
import type { Track } from "../types/track";

const BASE_URL = "https://api.audius.co/v1";

interface PlayerState {
  track: Track | null;
  playing: boolean;
  progress: number;
  duration: number;
  audio: HTMLAudioElement | null;
  queue: Track[];
  queueIndex: number;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  play: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setProgress: (t: number) => void;
  setDuration: (t: number) => void;
  setPlaying: (v: boolean) => void;
}

const buildAudio = (
  track: Track,
  set: (partial: Partial<PlayerState>) => void,
  get: () => PlayerState
) => {
  const prev = get().audio;
  if (prev) {
    prev.pause();
    prev.ontimeupdate = null;
    prev.onloadedmetadata = null;
    prev.onended = null;
    prev.src = "";
  }

  const audio = new Audio(`${BASE_URL}/tracks/${track.id}/stream`);

  let lastUpdate = 0;
  audio.ontimeupdate = () => {
    const now = Date.now();
    if (now - lastUpdate < 500) return;
    lastUpdate = now;
    set({ progress: audio.currentTime });
  };

  audio.onloadedmetadata = () => set({ duration: audio.duration });

  audio.onended = () => {
    const { queue, queueIndex } = get();
    if (queue.length > 1) {
      const nextIndex = (queueIndex + 1) % queue.length;
      set({ queueIndex: nextIndex });
      buildAudio(queue[nextIndex], set, get);
    } else {
      set({ playing: false });
    }
  };

  audio.play();
  set({ track, audio, playing: true, progress: 0, duration: 0 });

  // her mahnı çalanda lastPlayı güncəlləyir
  import("./useLastPlayed").then(({ useLastPlayed }) => {
    useLastPlayed.getState().setLastPlayed(track);
  });
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  track: null,
  playing: false,
  progress: 0,
  duration: 0,
  audio: null,
  queue: [],
  queueIndex: -1,

  setQueue: (tracks, startIndex = 0) => {
    set({ queue: tracks, queueIndex: startIndex });
  },

  nextTrack: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    set({ queueIndex: nextIndex });
    buildAudio(queue[nextIndex], set, get);
  },

  prevTrack: () => {
    const { queue, queueIndex, progress } = get();
    if (progress > 3) {
      const { audio } = get();
      if (audio) {
        audio.currentTime = 0;
        set({ progress: 0 });
      }
      return;
    }
    if (queue.length === 0) return;
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    set({ queueIndex: prevIndex });
    buildAudio(queue[prevIndex], set, get);
  },

  play: (track) => {
    const { audio: prev, track: currentTrack } = get();

    if (prev && currentTrack?.id === track.id) {
      prev.currentTime = 0;
      prev.play();
      set({ playing: true, progress: 0 });
      return;
    }

    const { queue } = get();
    const idx = queue.findIndex((t) => t.id === track.id);
    if (idx !== -1) set({ queueIndex: idx });

    buildAudio(track, set, get);
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