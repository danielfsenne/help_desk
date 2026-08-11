import { type SelectHTMLAttributes, forwardRef } from 'react'

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`h-10 px-3 rounded-lg border border-hairline bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export default Select
