import { http } from './http'

export interface AppNotification {
  id: number
  message: string
  ticketId: number
  read: boolean
  createdAt: string
}

export async function listNotifications(): Promise<AppNotification[]> {
  const { data } = await http.get<AppNotification[]>('/notifications')
  return data
}

export async function unreadCount(): Promise<number> {
  const { data } = await http.get<{ unread: number }>('/notifications/unread-count')
  return data.unread
}

export async function markAsRead(id: number): Promise<void> {
  await http.patch(`/notifications/${id}/read`)
}
