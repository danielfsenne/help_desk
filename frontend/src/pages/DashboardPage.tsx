import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listTickets } from '../api/tickets'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'
import type { Ticket } from '../types'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) return

    const filters = currentUser.role === 'CLIENT' ? { requesterId: currentUser.id } : {}

    listTickets(filters)
      .then(setTickets)
      .catch(() => setError('Não foi possível carregar os chamados.'))
      .finally(() => setLoading(false))
  }, [currentUser])

  const counts = useMemo(
    () => ({
      NEW: tickets.filter((t) => t.status === 'NEW').length,
      IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      RESOLVED: tickets.filter((t) => t.status === 'RESOLVED').length,
      CLOSED: tickets.filter((t) => t.status === 'CLOSED').length,
    }),
    [tickets],
  )

  const canOpenTicket = currentUser?.role === 'CLIENT'
  const showRequester = currentUser?.role !== 'CLIENT'

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Olá, {currentUser?.name}</h1>
          <span style={{ color: '#666', fontSize: 13 }}>{currentUser?.role}</span>
        </div>
        <button onClick={logout}>Sair</button>
      </header>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <StatCard label="Novos" value={counts.NEW} color={STATUS_COLORS.NEW} />
        <StatCard label="Em atendimento" value={counts.IN_PROGRESS} color={STATUS_COLORS.IN_PROGRESS} />
        <StatCard label="Resolvidos" value={counts.RESOLVED} color={STATUS_COLORS.RESOLVED} />
        <StatCard label="Fechados" value={counts.CLOSED} color={STATUS_COLORS.CLOSED} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>{canOpenTicket ? 'Meus chamados' : 'Chamados'}</h2>
        {canOpenTicket && (
          <Link to="/tickets/new">
            <button>+ Novo chamado</button>
          </Link>
        )}
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && !error && tickets.length === 0 && <p style={{ color: '#666' }}>Nenhum chamado encontrado.</p>}

      {!loading && tickets.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ padding: 8 }}>Título</th>
              {showRequester && <th style={{ padding: 8 }}>Solicitante</th>}
              <th style={{ padding: 8 }}>Prioridade</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
              >
                <td style={{ padding: 8 }}>{ticket.id}</td>
                <td style={{ padding: 8 }}>{ticket.title}</td>
                {showRequester && <td style={{ padding: 8 }}>{ticket.requester.name}</td>}
                <td style={{ padding: 8 }}>
                  <Badge label={PRIORITY_LABELS[ticket.priority]} color={PRIORITY_COLORS[ticket.priority]} />
                </td>
                <td style={{ padding: 8 }}>
                  <Badge label={STATUS_LABELS[ticket.status]} color={STATUS_COLORS[ticket.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, border: '1px solid #eee', borderRadius: 8, padding: 16, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#666', fontSize: 13 }}>{label}</div>
    </div>
  )
}
