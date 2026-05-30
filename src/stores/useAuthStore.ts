import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AudiusUser } from "../types/users"; 

interface tokenAll {
  accessToken: string;
  refreshToken: string;
  hasHydrated: boolean;
  localAvatar: string;
  user: AudiusUser | null;

  email: string;
  password: string;

  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: AudiusUser) => void;
  updateUser: (fields: Partial<AudiusUser>) => void;
  updateAvatarProfile: (avatar:string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<tokenAll>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      localAvatar: "",
      hasHydrated: false,
      user: null,
      email: "",
      password: "",

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      updateAvatarProfile: (avatar) =>set({localAvatar: avatar}),
      setUser: (user) => set({ user }),
      updateUser: (fields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...fields } : null,
        })),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      clearToken: () => set({ accessToken: "", refreshToken: "", user: null, email: "", password: "" }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);