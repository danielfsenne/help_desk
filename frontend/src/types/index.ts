export type Role = 'ADMIN' | 'ATTENDANT' | 'CLIENT'

export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  createdAt: string
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
  requester: User
  attendant: User | null
  category: Category
}

export interface Comment {
  id: number
  message: string
  createdAt: string
  author: User
}
