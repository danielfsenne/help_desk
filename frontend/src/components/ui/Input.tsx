import { type InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`h-10 px-3 rounded-lg border border-hairline bg-white text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 ${className}`}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export default Input
