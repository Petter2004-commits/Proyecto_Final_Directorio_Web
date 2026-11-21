import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth.store"
import { login } from "@/services/auth.service"
import { getErrorMessage } from "@/utils/getErrorMessage"
import axios from "axios"

const schema = z.object({
  username: z.string().min(1, "Escriba su usuario"),
  password: z.string().min(1, "Escriba su contraseña"),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, setSession } = useAuthStore()

  useEffect(() => {
    if (user) navigate("/empleados", { replace: true })
  }, [user, navigate])

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const session = await login(data.username, data.password)
      setSession(session.user, session.accessToken, session.refreshToken)
      navigate("/empleados")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError("root", { message: "Usuario o contraseña incorrectos." })
      } else {
        setError("root", { message: getErrorMessage(error) })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Directorio de Empleados</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Usuario</Label>
            <Input id="username" {...register("username")} autoComplete="username" />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register("password")} autoComplete="current-password" />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          {errors.root && (
            <p className="text-sm text-destructive text-center">{errors.root.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  )
}