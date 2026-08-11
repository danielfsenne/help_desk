import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink mb-3 transition-colors"
      >
        <ArrowLeft size={15} /> Voltar
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="text-ink-muted text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  )
}
