import { http } from './http'
import type { Role, User } from '../types'

export interface UserRequest {
  name: string
  email: string
  password: string
  role: Role
}

export async function listUsers(): Promise<User[]> {
  const { data } = await http.get<User[]>('/users')
  return data
}

export async function getUser(id: number): Promise<User> {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

export async function createUser(payload: UserRequest): Promise<User> {
  const { data } = await http.post<User>('/users', payload)
  return data
}
