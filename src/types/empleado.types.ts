export interface Empleado {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  image: string
  company: {
    department: string
    title: string
  }
  address: {
    address: string
    city: string
    state: string
  }
}

export interface EmpleadosResponse {
  users: Empleado[]
  total: number
  skip: number
  limit: number
}