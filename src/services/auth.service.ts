import axios from "axios"
import type { AuthSession } from "@/types/auth.types"

const baseURL = import.meta.env.VITE_API_URL ?? "https://dummyjson.com"

// Cliente sin interceptores — solo para login y refresh
const authClient = axios.create({ baseURL })

export async function login(username: string, password: string): Promise<AuthSession> {
  const { data } = await authClient.post("/auth/login", {
    username,
    password,
    expiresInMins: 1,
  })
  return data
}

export async function refreshSession(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await authClient.post("/auth/refresh", {
    refreshToken,
    expiresInMins: 1,
  })
  return data
}