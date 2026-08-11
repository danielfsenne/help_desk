import { CheckCircle2, Clock, FolderOpen, Inbox, Plus, Search, TicketX, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listCategories } from '../api/categories'
import { listTickets } from '../api/tickets'
import AppShell from '../components/AppShell'
import Badge from '../components/Badge'
import SlaBadge from '../components/SlaBadge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../context/AuthContext'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'
import type { Category, Ticket, TicketPriority, TicketStatus } from '../types'

export default function DashboardPage() {
  const { currentUser } = useAuth()
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
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Olá, {currentUser?.name.split(' ')[0]}</h1>
          <p className="text-ink-muted text-sm">
            {canOpenTicket ? 'Acompanhe seus chamados abertos' : 'Visão geral dos chamados'}
          </p>
        </div>
        {canOpenTicket && (
          <Link to="/tickets/new">
            <Button>
              <Plus size={16} /> Novo chamado
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Novos" value={counts.NEW} color={STATUS_COLORS.NEW} icon={Inbox} />
        <StatCard label="Em atendimento" value={counts.IN_PROGRESS} color={STATUS_COLORS.IN_PROGRESS} icon={Clock} />
        <StatCard label="Resolvidos" value={counts.RESOLVED} color={STATUS_COLORS.RESOLVED} icon={CheckCircle2} />
        <StatCard label="Fechados" value={counts.CLOSED} color={STATUS_COLORS.CLOSED} icon={FolderOpen} />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus | '')}>
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority | '')}>
          <option value="">Todas as prioridades</option>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X size={14} /> Limpar
          </Button>
        )}
      </div>

      {error && <p className="text-priority-critical text-sm mb-4">{error}</p>}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-ink-muted text-sm">Carregando...</div>
        ) : tickets.length === 0 ? (
          <EmptyState icon={TicketX} message="Nenhum chamado encontrado." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-muted border-b border-hairline">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Título</th>
                  {showRequester && <th className="px-4 py-3 font-medium">Solicitante</th>}
                  <th className="px-4 py-3 font-medium">Prioridade</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">SLA</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="border-b border-hairline last:border-0 cursor-pointer hover:bg-page transition-colors"
                  >
                    <td className="px-4 py-3 text-ink-muted">#{ticket.id}</td>
                    <td className="px-4 py-3 text-ink font-medium">{ticket.title}</td>
                    {showRequester && <td className="px-4 py-3 text-ink-secondary">{ticket.requester.name}</td>}
                    <td className="px-4 py-3">
                      <Badge label={PRIORITY_LABELS[ticket.priority]} color={PRIORITY_COLORS[ticket.priority]} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={STATUS_LABELS[ticket.status]} color={STATUS_COLORS[ticket.status]} />
                    </td>
                    <td className="px-4 py-3">
                      <SlaBadge ticket={ticket} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppShell>
  )
}
