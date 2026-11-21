import axios from "axios"
import { useAuthStore } from "@/store/auth.store"
import { refreshSession } from "./auth.service"

const baseURL = import.meta.env.VITE_API_URL ?? "https://dummyjson.com"

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Si no hay respuesta es error de red — no intentar renovar
    if (!error.response) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !original._retry && !isRefreshing) {
      original._retry = true
      isRefreshing = true

      try {
        const { refreshToken } = useAuthStore.getState()
        if (!refreshToken) throw new Error("No refresh token")

        const tokens = await refreshSession(refreshToken)
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken)

        original.headers.Authorization = `Bearer ${tokens.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearSession()
        window.location.href = "/login"
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)