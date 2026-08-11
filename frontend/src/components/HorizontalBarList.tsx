export interface BarItem {
  label: string
  value: number
  color: string
}

export default function HorizontalBarList({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 group">
          <div className="w-32 text-sm text-ink-secondary shrink-0 truncate">{item.label}</div>
          <div className="flex-1 h-2 rounded-full bg-page overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
                minWidth: item.value > 0 ? 4 : 0,
              }}
            />
          </div>
          <div className="w-7 text-right text-sm font-semibold text-ink tabular-nums shrink-0">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
