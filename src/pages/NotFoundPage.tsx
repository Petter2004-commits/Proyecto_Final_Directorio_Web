import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página no encontrada.</p>
      <Button asChild variant="outline">
        <Link to="/empleados">Volver al directorio</Link>
      </Button>
    </div>
  )
}