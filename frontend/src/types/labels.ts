import type { TicketPriority, TicketStatus } from './index'

export const STATUS_LABELS: Record<TicketStatus, string> = {
  NEW: 'Novo',
  IN_PROGRESS: 'Em atendimento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: '#6b7280',
  MEDIUM: '#2563eb',
  HIGH: '#d97706',
  CRITICAL: '#dc2626',
}

export const STATUS_COLORS: Record<TicketStatus, string> = {
  NEW: '#2563eb',
  IN_PROGRESS: '#d97706',
  RESOLVED: '#16a34a',
  CLOSED: '#6b7280',
}
