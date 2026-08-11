import type { LucideIcon } from 'lucide-react'

export default function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-ink-muted">
      <Icon size={32} strokeWidth={1.5} />
      <p className="text-sm">{message}</p>
    </div>
  )
}
