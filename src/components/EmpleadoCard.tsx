import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Empleado } from "@/types/empleado.types"

interface Props {
  empleado: Empleado
  onDelete: (id: number, nombre: string) => void
}

export default function EmpleadoCard({ empleado, onDelete }: Props) {
  const nombre = `${empleado.firstName} ${empleado.lastName}`

  return (
    <article className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-3">
      <img
        src={empleado.image}
        alt={nombre}
        className="w-20 h-20 rounded-full object-cover mx-auto"
      />
      <div className="text-center space-y-1">
        <p className="font-semibold">{nombre}</p>
        <p className="text-sm text-muted-foreground">{empleado.company.department}</p>
        <p className="text-sm text-muted-foreground">{empleado.company.title}</p>
        <p className="text-xs text-muted-foreground truncate">{empleado.email}</p>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Link
          to={`/empleados/${empleado.id}`}
          className="text-sm text-center text-primary hover:underline"
        >
          Ver detalle
        </Link>
        <Button
          variant="destructive"
          size="sm"
          aria-label={`Eliminar ${nombre}`}
          onClick={() => onDelete(empleado.id, nombre)}
        >
          Eliminar
        </Button>
      </div>
    </article>
  )
}