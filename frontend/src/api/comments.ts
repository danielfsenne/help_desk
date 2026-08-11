import { http } from './http'
import type { Comment } from '../types'

export async function listComments(ticketId: number): Promise<Comment[]> {
  const { data } = await http.get<Comment[]>(`/tickets/${ticketId}/comments`)
  return data
}

export async function addComment(ticketId: number, message: string): Promise<Comment> {
  const { data } = await http.post<Comment>(`/tickets/${ticketId}/comments`, { message })
  return data
}
