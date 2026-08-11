export interface BarItem {
  label: string
  value: number
  color: string
}

export default function HorizontalBarList({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 130, fontSize: 13, color: '#444', flexShrink: 0 }}>{item.label}</div>
          <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 6, height: 14, position: 'relative' }}>
            <div
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color,
                height: '100%',
                borderRadius: 6,
                minWidth: item.value > 0 ? 6 : 0,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ width: 28, textAlign: 'right', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
