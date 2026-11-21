import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/auth.types"

interface AuthState {
  user: User | null
  accessToken: string
  refreshToken: string
  setSession: (user: User, accessToken: string, refreshToken: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      refreshToken: "",
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      clearSession: () =>
        set({ user: null, accessToken: "", refreshToken: "" }),
    }),
    { name: "auth-storage" }
  )
)