import { type TextareaHTMLAttributes, forwardRef } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`px-3 py-2 rounded-lg border border-hairline bg-white text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 resize-none ${className}`}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export default Textarea
