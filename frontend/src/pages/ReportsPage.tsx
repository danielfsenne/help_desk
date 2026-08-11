import { CheckCircle2, Timer, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getReportSummary, type ReportSummary } from '../api/reports'
import AppShell from '../components/AppShell'
import HorizontalBarList from '../components/HorizontalBarList'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../types/labels'

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}min`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  return `${hours}h ${rest}min`
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getReportSummary()
      .then(setSummary)
      .catch(() => setError('Não foi possível carregar os relatórios.'))
  }, [])

  if (error) {
    return (
      <AppShell>
        <p className="text-priority-critical text-sm">{error}</p>
      </AppShell>
    )
  }

  if (!summary) {
    return (
      <AppShell>
        <div className="py-20 text-center text-ink-muted text-sm">Carregando...</div>
      </AppShell>
    )
  }

  const statusItems = (Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map((status) => ({
    label: STATUS_LABELS[status],
    value: summary.byStatus[status] ?? 0,
    color: STATUS_COLORS[status],
  }))

  const priorityItems = (Object.keys(PRIORITY_LABELS) as (keyof typeof PRIORITY_LABELS)[]).map((priority) => ({
    label: PRIORITY_LABELS[priority],
    value: summary.byPriority[priority] ?? 0,
    color: PRIORITY_COLORS[priority],
  }))

  const attendantItems = summary.byAttendant.map((a) => ({
    label: a.attendantName,
    value: a.ticketCount,
    color: '#2a78d6',
  }))

  return (
    <AppShell>
      <PageHeader title="Relatórios" subtitle="Métricas gerais do atendimento" />

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Tempo médio de resolução"
          value={summary.avgResolutionMinutes != null ? formatMinutes(summary.avgResolutionMinutes) : '—'}
          color="#2a78d6"
          icon={Timer}
        />
        <StatCard
          label="Resolvidos dentro do SLA"
          value={summary.slaComplianceRate != null ? `${summary.slaComplianceRate.toFixed(0)}%` : '—'}
          color="#1baf7a"
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-secondary mb-4">Chamados por status</h2>
          <HorizontalBarList items={statusItems} />
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-secondary mb-4">Chamados por prioridade</h2>
          <HorizontalBarList items={priorityItems} />
        </Card>

        <Card className="p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-ink-secondary mb-4">Carga por atendente</h2>
          {attendantItems.length === 0 ? (
            <EmptyState icon={Users} message="Nenhum chamado atribuído ainda." />
          ) : (
            <HorizontalBarList items={attendantItems} />
          )}
        </Card>
      </div>
    </AppShell>
  )
}
