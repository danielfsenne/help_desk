import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-priority-critical/10 text-priority-critical">
        <AlertTriangle size={12} /> SLA violado
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-priority-low/10 text-priority-low">
        <CheckCircle2 size={12} /> Dentro do SLA
      </span>
    )
  }

  const remainingMs = new Date(ticket.slaDeadline).getTime() - Date.now()

  if (remainingMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-priority-critical/10 text-priority-critical">
        <AlertTriangle size={12} /> SLA violado
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-priority-medium/10 text-[#a06600]">
      <Clock size={12} /> {formatRemaining(remainingMs)} restantes
    </span>
  )
}
