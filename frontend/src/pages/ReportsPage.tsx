import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReportSummary, type ReportSummary } from '../api/reports'
import HorizontalBarList from '../components/HorizontalBarList'
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

  if (error) return <p style={{ padding: 24, color: 'crimson' }}>{error}</p>
  if (!summary) return <p style={{ padding: 24 }}>Carregando...</p>

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
    color: '#2563eb',
  }))

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <Link to="/dashboard">&larr; Voltar</Link>
      <h1>Relatórios</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {summary.avgResolutionMinutes != null ? formatMinutes(summary.avgResolutionMinutes) : '—'}
          </div>
          <div style={{ color: '#666', fontSize: 13 }}>Tempo médio de resolução</div>
        </div>
        <div style={{ flex: 1, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {summary.slaComplianceRate != null ? `${summary.slaComplianceRate.toFixed(0)}%` : '—'}
          </div>
          <div style={{ color: '#666', fontSize: 13 }}>Chamados resolvidos dentro do SLA</div>
        </div>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16 }}>Chamados por status</h2>
        <HorizontalBarList items={statusItems} />
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16 }}>Chamados por prioridade</h2>
        <HorizontalBarList items={priorityItems} />
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16 }}>Carga por atendente</h2>
        {attendantItems.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhum chamado atribuído ainda.</p>
        ) : (
          <HorizontalBarList items={attendantItems} />
        )}
      </section>
    </div>
  )
}
