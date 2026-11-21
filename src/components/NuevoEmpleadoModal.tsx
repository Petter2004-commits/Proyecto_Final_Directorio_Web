import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEmpleado } from "@/services/empleados.service"

const schema = z.object({
  firstName: z.string().min(2, "El nombre necesita al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido necesita al menos 2 caracteres"),
  email: z.string().email("Escriba un correo válido"),
 age: z
    .number()
    .int("La edad debe ser un entero entre 18 y 99")
    .min(18, "La edad debe ser un entero entre 18 y 99")
    .max(99, "La edad debe ser un entero entre 18 y 99"),
})

type FormData = z.infer<typeof schema>

export default function NuevoEmpleadoModal() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: createEmpleado,
    onSuccess: () => {
      toast.success("Empleado creado (la API lo simula y no lo guarda).")
      queryClient.invalidateQueries({ queryKey: ["empleados"] })
      handleClose()
    },
  })

  const handleClose = () => {
    reset()
    setFileError(null)
    setSelectedFile(null)
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreview(null)
    setOpen(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)
    setSelectedFile(null)
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreview(null)

    if (!file) return

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFileError("Solo se permiten imágenes JPG o PNG.")
      return
    }
    if (file.size > 1024 * 1024) {
      setFileError("La imagen supera 1 MB.")
      return
    }

    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    setPreview(url)
    setSelectedFile(file)
  }

  const onSubmit = async (data: FormData) => {
    const formData = new FormData()
    formData.append("firstName", data.firstName)
    formData.append("lastName", data.lastName)
    formData.append("email", data.email)
    formData.append("age", String(data.age))
    if (selectedFile) formData.append("image", selectedFile)
    mutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        <Button>Nuevo empleado</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Nuevo empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Apellido</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="image">Fotografía (JPG o PNG, máx. 1 MB)</Label>
            <Input id="image" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
            {fileError && <p className="text-sm text-destructive">{fileError}</p>}
            {preview && (
              <img src={preview} alt="Vista previa" className="w-20 h-20 rounded-full object-cover mt-2" />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}