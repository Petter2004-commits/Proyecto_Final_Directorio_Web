import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { getEmpleado } from "@/services/empleados.service"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function DetallePage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)

  const { data: empleado, isLoading, isError, error } = useQuery({
    queryKey: ["empleado", numId],
    queryFn: () => getEmpleado(numId),
    retry: false,
  })

  const handleDescargarImagen = async () => {
    if (!empleado) return
    try {
      const response = await api.get(empleado.image, { responseType: "blob" })
      const url = URL.createObjectURL(response.data)
      const a = document.createElement("a")
      a.href = url
      a.download = `empleado-${empleado.id}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDescargarFicha = () => {
    if (!empleado) return
    const lines = [
      `Empleado: ${empleado.firstName} ${empleado.lastName}`,
      `Cargo: ${empleado.company.title}`,
      `Departamento: ${empleado.company.department}`,
      `Correo: ${empleado.email}`,
      `Teléfono: ${empleado.phone}`,
      `Edad: ${empleado.age}`,
      `Dirección: ${empleado.address.address}, ${empleado.address.city}, ${empleado.address.state}`,
    ].join("\n")

    const blob = new Blob([lines], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `empleado-${empleado.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const is404 =
    isError && axios.isAxiosError(error) && error.response?.status === 404

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link
          to="/empleados"
          className="text-sm text-primary hover:underline"
        >
          ← Volver al listado
        </Link>

        {isLoading && <p>Cargando…</p>}

        {isError && (
          <p className="text-destructive">
            {is404
              ? "No se encontró el recurso solicitado."
              : getErrorMessage(error)}
          </p>
        )}

        {empleado && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <img
                src={empleado.image}
                alt={`${empleado.firstName} ${empleado.lastName}`}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl font-bold">
                  {empleado.firstName} {empleado.lastName}
                </h1>
                <p className="text-muted-foreground">{empleado.company.title}</p>
                <p className="text-muted-foreground">{empleado.company.department}</p>
                <div className="text-sm space-y-1 mt-2">
                  <p><span className="font-medium">Correo:</span> {empleado.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {empleado.phone}</p>
                  <p><span className="font-medium">Edad:</span> {empleado.age}</p>
                  <p>
                    <span className="font-medium">Dirección:</span>{" "}
                    {empleado.address.address}, {empleado.address.city}, {empleado.address.state}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleDescargarImagen}>
                Descargar imagen
              </Button>
              <Button variant="outline" onClick={handleDescargarFicha}>
                Descargar ficha
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}