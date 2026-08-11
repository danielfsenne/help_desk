import type { ReactNode } from 'react'

export default function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-secondary">{label}</span>
      {children}
    </label>
  )
}
