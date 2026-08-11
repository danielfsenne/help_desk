import { http } from './http'
import type { User } from '../types'

export interface LoginResponse {
  token: string
  user: User
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const { data } = await http.post<User>('/auth/register', { name, email, password })
  return data
}
