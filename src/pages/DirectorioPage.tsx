import { useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useAuthStore } from "@/store/auth.store"
import { getEmpleados, searchEmpleados, deleteEmpleado } from "@/services/empleados.service"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import EmpleadoCard from "@/components/EmpleadoCard"
import NuevoEmpleadoModal from "@/components/NuevoEmpleadoModal"
import { useState } from "react"

export default function DirectorioPage() {
  const { user, clearSession } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const rawPage = parseInt(searchParams.get("page") ?? "1")
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
  const q = searchParams.get("q") ?? ""

  const [inputValue, setInputValue] = useState(q)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["empleados", page, q],
    queryFn: () => q ? searchEmpleados(q, page) : getEmpleados(page),
    placeholderData: (prev) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEmpleado,
    onSuccess: (_, deletedId) => {
      toast.success("Empleado eliminado (simulado).")
      queryClient.setQueriesData(
        { queryKey: ["empleados"] },
        (old: { users: { id: number }[], total: number, skip: number, limit: number } | undefined) => {
          if (!old) return old
          return {
            ...old,
            users: old.users.filter((u) => u.id !== deletedId),
          }
        }
      )
    },
  })

  const totalPages = data ? Math.ceil(data.total / 8) : 1

  const handleSearch = () => {
    const trimmed = inputValue.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed, page: "1" })
    } else {
      setSearchParams({ page: "1" })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (val === "") {
      setSearchParams({ page: "1" })
    }
  }

  const handleDelete = (id: number, nombre: string) => {
    if (window.confirm(`¿Eliminar a ${nombre}? La API simula la baja.`)) {
      deleteMutation.mutate(id)
    }
  }

  const goToPage = (newPage: number) => {
    const params: Record<string, string> = { page: String(newPage) }
    if (q) params.q = q
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold">Directorio de empleados</h1>
            <p className="text-sm text-muted-foreground">{user?.firstName} {user?.lastName}</p>
          </div>
          <Button variant="outline" onClick={() => clearSession()}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Buscar"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Buscar</Button>
          <div className="sm:ml-auto">
            <NuevoEmpleadoModal />
          </div>
        </div>

        {isLoading && <p className="text-center py-8">Cargando…</p>}

        {isError && (
          <Alert className="border-destructive">
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{getErrorMessage(error)}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && q && (
          <p className="text-sm text-muted-foreground">
            {data?.total === 0
              ? "No hay resultados para la búsqueda."
              : `${data?.total} resultados`}
          </p>
        )}

        {!isLoading && !isError && data && data.users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.users.map((emp) => (
              <EmpleadoCard
                key={emp.id}
                empleado={emp}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <span className="text-sm">Página {page} de {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}