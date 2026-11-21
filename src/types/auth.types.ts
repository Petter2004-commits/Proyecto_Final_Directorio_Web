export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
}