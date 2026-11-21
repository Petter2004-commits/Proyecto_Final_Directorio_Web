export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
}

export interface AuthSession {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}