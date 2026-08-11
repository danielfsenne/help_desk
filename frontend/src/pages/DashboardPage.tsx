import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { listTickets } from '../api/tickets'
import Badge from '../components/Badge'
import NotificationBell from '../components/NotificationBell'
import SlaBadge from '../components/SlaBadge'
import { useAuth } from '../context/AuthContext'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'
import type { Category, Ticket, TicketPriority, TicketStatus } from '../types'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [allTickets, setAllTickets] = useState<Ticket[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [status, setStatus] = useState<TicketStatus | ''>('')
  const [priority, setPriority] = useState<TicketPriority | ''>('')
  const [categoryId, setCategoryId] = useState('')
  const [search, setSearch] = useState('')

  const baseFilters = useMemo(
    () => (currentUser?.role === 'CLIENT' ? { requesterId: currentUser.id } : {}),
    [currentUser],
  )

  useEffect(() => {
    if (!currentUser) return
    listTickets(baseFilters).then(setAllTickets).catch(() => {})
    listCategories().then(setCategories).catch(() => {})
  }, [currentUser, baseFilters])

  useEffect(() => {
    if (!currentUser) return

    const timeout = setTimeout(() => {
      setLoading(true)
      listTickets({
        ...baseFilters,
        status: status || undefined,
        priority: priority || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        search: search || undefined,
      })
        .then(setTickets)
        .catch(() => setError('Não foi possível carregar os chamados.'))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [currentUser, baseFilters, status, priority, categoryId, search])

  const counts = useMemo(
    () => ({
      NEW: allTickets.filter((t) => t.status === 'NEW').length,
      IN_PROGRESS: allTickets.filter((t) => t.status === 'IN_PROGRESS').length,
      RESOLVED: allTickets.filter((t) => t.status === 'RESOLVED').length,
      CLOSED: allTickets.filter((t) => t.status === 'CLOSED').length,
    }),
    [allTickets],
  )

  const canOpenTicket = currentUser?.role === 'CLIENT'
  const showRequester = currentUser?.role !== 'CLIENT'
  const hasActiveFilters = status || priority || categoryId || search

  function clearFilters() {
    setStatus('')
    setPriority('')
    setCategoryId('')
    setSearch('')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Olá, {currentUser?.name}</h1>
          <span style={{ color: '#666', fontSize: 13 }}>{currentUser?.role}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {currentUser?.role === 'ADMIN' && (
            <>
              <Link to="/categories">
                <button>Categorias</button>
              </Link>
              <Link to="/reports">
                <button>Relatórios</button>
              </Link>
            </>
          )}
          <NotificationBell />
          <button onClick={logout}>Sair</button>
        </div>
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, flex: 1, minWidth: 180 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus | '')} style={{ padding: 8 }}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority | '')}
          style={{ padding: 8 }}
        >
          <option value="">Todas as prioridades</option>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ padding: 8 }}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {hasActiveFilters && <button onClick={clearFilters}>Limpar filtros</button>}
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
              <th style={{ padding: 8 }}>SLA</th>
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
                <td style={{ padding: 8 }}>
                  <SlaBadge ticket={ticket} />
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
