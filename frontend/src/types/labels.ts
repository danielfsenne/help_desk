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

// Priority maps onto the fixed good/warning/serious/critical status palette —
// it is a real severity scale, unlike ticket status below.
export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: '#0ca30c',
  MEDIUM: '#fab219',
  HIGH: '#ec835a',
  CRITICAL: '#d03b3b',
}

// Ticket status is a workflow stage, not a severity — uses categorical hues
// deliberately distinct from the priority palette above.
export const STATUS_COLORS: Record<TicketStatus, string> = {
  NEW: '#2a78d6',
  IN_PROGRESS: '#eb6834',
  RESOLVED: '#1baf7a',
  CLOSED: '#898781',
}
