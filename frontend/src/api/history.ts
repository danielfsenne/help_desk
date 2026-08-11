import { http } from './http'

export interface TicketHistoryEntry {
  id: number
  description: string
  createdAt: string
  changedBy: {
    id: number
    name: string
  }
}

export async function listHistory(ticketId: number): Promise<TicketHistoryEntry[]> {
  const { data } = await http.get<TicketHistoryEntry[]>(`/tickets/${ticketId}/history`)
  return data
}
