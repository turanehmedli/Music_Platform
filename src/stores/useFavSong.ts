import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Track {
  id: string;
  title: string;
  duration?: string;

  user?: {
    name: string;
  };

  artwork?: {
    "150x150"?: string;
    "480x480"?: string;
    "1000x1000"?: string;
  };
}

interface FavoriteState {
  favorites: Track[];

  addFavorite: (track: Track) => void;
  removeFavorite: (id: string) => void;

  toggleFavorite: (track: Track) => void;

  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoriteState>()(
  persist<FavoriteState>(
    (set, get) => ({
      favorites: [],

      addFavorite: (track) =>
        set((state) => ({
          favorites: [...state.favorites, track],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (item) => item.id !== id
          ),
        })),

      toggleFavorite: (track) => {
        const exists = get().favorites.some(
          (item) => item.id === track.id
        );

        if (exists) {
          set((state) => ({
            favorites: state.favorites.filter(
              (item) => item.id !== track.id
            ),
          }));
        } else {
          set((state) => ({
            favorites: [...state.favorites, track],
          }));
        }
      },

      isFavorite: (id) => {
        return get().favorites.some(
          (item) => item.id === id
        );
      },
    }),
    {
      name: "favorite-storage",
    }
  )
);
