import axios from "axios"

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Sin conexión con el servidor. Verifique su internet."
    }
    switch (error.response.status) {
      case 400: return "Los datos enviados no son válidos."
      case 401: return "Su sesión expiró. Inicie sesión de nuevo."
      case 403: return "No tiene permiso para realizar esta acción."
      case 404: return "No se encontró el recurso solicitado."
      case 429: return "Demasiadas solicitudes. Espere un momento."
      default:
        if (error.response.status >= 500) {
          return "Error del servidor. Intente más tarde."
        }
        return "Ocurrió un error inesperado."
    }
  }
  return "Ocurrió un error inesperado."
}