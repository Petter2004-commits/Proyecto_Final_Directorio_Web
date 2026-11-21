import { api } from "./api"
import type { Empleado, EmpleadosResponse } from "@/types/empleado.types"

const SELECT = "firstName,lastName,email,phone,age,image,company,address"

export async function getEmpleados(page: number): Promise<EmpleadosResponse> {
  const skip = (page - 1) * 8
  const { data } = await api.get("/auth/users", {
    params: { limit: 8, skip, select: SELECT },
  })
  return data
}

export async function searchEmpleados(q: string, page: number): Promise<EmpleadosResponse> {
  const skip = (page - 1) * 8
  const { data } = await api.get("/auth/users/search", {
    params: { q, limit: 8, skip, select: SELECT },
  })
  return data
}

export async function getEmpleado(id: number): Promise<Empleado> {
  const { data } = await api.get(`/auth/users/${id}`, {
    params: { select: SELECT },
  })
  return data
}

export async function createEmpleado(formData: FormData): Promise<Empleado> {
  const { data } = await api.post("/users/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export async function deleteEmpleado(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}