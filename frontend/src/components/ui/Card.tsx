import type { HTMLAttributes } from 'react'

export default function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-hairline rounded-xl shadow-card ${className}`}
      {...props}
    />
  )
}
