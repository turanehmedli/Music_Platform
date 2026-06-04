import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track } from "../types/track";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  createdAt: Date;
  cover?: string;
  isPublic: boolean;
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;

  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  reorderTracks: (playlistId: string, from: number, to: number) => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      currentPlaylist: null,

      createPlaylist: (name, description) => {
        const newPlaylist: Playlist = {
          id: `playlist_${Date.now()}`,
          name,
          description: description ?? "",
          tracks: [],
          createdAt: new Date(),
          isPublic: false,
        };
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
        return newPlaylist;
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
          currentPlaylist:
            state.currentPlaylist?.id === id ? null : state.currentPlaylist,
        }));
      },

      addTrackToPlaylist: (playlistId, track) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.some((t) => t.id === track.id)
                    ? p.tracks
                    : [...p.tracks, track],
                }
              : p,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  tracks: state.currentPlaylist.tracks.some(
                    (t) => t.id === track.id,
                  )
                    ? state.currentPlaylist.tracks
                    : [...state.currentPlaylist.tracks, track],
                }
              : state.currentPlaylist,
        }));
      },

      removeTrackFromPlaylist: (playlistId, trackId) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
              : p,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  tracks: state.currentPlaylist.tracks.filter(
                    (t) => t.id !== trackId,
                  ),
                }
              : state.currentPlaylist,
        }));
      },

      setCurrentPlaylist: (playlist) => {
        set({ currentPlaylist: playlist });
      },

      updatePlaylist: (id, updates) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
          currentPlaylist:
            state.currentPlaylist?.id === id
              ? { ...state.currentPlaylist, ...updates }
              : state.currentPlaylist,
        }));
      },

      getPlaylistById: (id) => {
        return get().playlists.find((p) => p.id === id);
      },

      reorderTracks: (playlistId, from, to) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            const tracks = [...p.tracks];
            const [removed] = tracks.splice(from, 1);
            tracks.splice(to, 0, removed);
            return { ...p, tracks };
          }),
          currentPlaylist:
            state.currentPlaylist?.id === playlistId
              ? {
                  ...state.currentPlaylist,
                  tracks: (() => {
                    const tracks = [...state.currentPlaylist.tracks];
                    const [removed] = tracks.splice(from, 1);
                    tracks.splice(to, 0, removed);
                    return tracks;
                  })(),
                }
              : state.currentPlaylist,
        }));
      },
    }),
    {
      name: "playlist-storage",
      partialize: (state) => ({ playlists: state.playlists }),
    },
  ),
);