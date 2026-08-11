import { http } from './http'
import type { Category } from '../types'

export interface CategoryRequest {
  name: string
  description: string | null
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await http.get<Category[]>('/categories')
  return data
}

export async function createCategory(payload: CategoryRequest): Promise<Category> {
  const { data } = await http.post<Category>('/categories', payload)
  return data
}

export async function updateCategory(id: number, payload: CategoryRequest): Promise<Category> {
  const { data } = await http.put<Category>(`/categories/${id}`, payload)
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await http.delete(`/categories/${id}`)
}
