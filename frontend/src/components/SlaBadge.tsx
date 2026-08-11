import { useEffect, useState } from 'react'
import Badge from './Badge'
import type { Ticket } from '../types'

function formatRemaining(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  if (totalMinutes < 60) return `${totalMinutes}min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}min`
}

type SlaTicket = Pick<Ticket, 'status' | 'slaDeadline' | 'slaBreached'>

export default function SlaBadge({ ticket }: { ticket: SlaTicket }) {
  const [, forceTick] = useState(0)
  const isFinal = ticket.status === 'CLOSED' || ticket.status === 'RESOLVED'

  useEffect(() => {
    if (isFinal) return
    const interval = setInterval(() => forceTick((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [isFinal])

  if (isFinal) {
    return ticket.slaBreached ? (
      <Badge label="SLA violado" color="#dc2626" />
    ) : (
      <Badge label="Dentro do SLA" color="#16a34a" />
    )
  }

  const remainingMs = new Date(ticket.slaDeadline).getTime() - Date.now()

  if (remainingMs <= 0) {
    return <Badge label="⚠ SLA violado" color="#dc2626" />
  }

  return <Badge label={`⏱ ${formatRemaining(remainingMs)} restantes`} color="#d97706" />
}
