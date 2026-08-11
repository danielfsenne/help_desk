import type { LucideIcon } from 'lucide-react'
import Card from './Card'

export default function StatCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string
  value: string | number
  color: string
  icon: LucideIcon
}) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-semibold text-ink leading-tight">{value}</div>
        <div className="text-ink-muted text-xs">{label}</div>
      </div>
    </Card>
  )
}
