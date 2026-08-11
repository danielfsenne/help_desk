import { http } from './http'
import type { Ticket, TicketPriority, TicketStatus } from '../types'

export interface TicketRequest {
  title: string
  description: string
  priority: TicketPriority
  categoryId: number
}

export interface TicketFilters {
  requesterId?: number
  attendantId?: number
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: number
  search?: string
}

export async function listTickets(filters: TicketFilters = {}): Promise<Ticket[]> {
  const { data } = await http.get<Ticket[]>('/tickets', { params: filters })
  return data
}

export async function getTicket(id: number): Promise<Ticket> {
  const { data } = await http.get<Ticket>(`/tickets/${id}`)
  return data
}

export async function createTicket(payload: TicketRequest): Promise<Ticket> {
  const { data } = await http.post<Ticket>('/tickets', payload)
  return data
}

export async function assignTicket(id: number): Promise<Ticket> {
  const { data } = await http.patch<Ticket>(`/tickets/${id}/assign`, {})
  return data
}

export async function updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
  const { data } = await http.patch<Ticket>(`/tickets/${id}/status`, { status })
  return data
}
