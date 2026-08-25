import type { ReactNode } from 'react'

// The one small recurring mark tying every section to the same hand —
// not a divider or a rule, just a label prefix reused throughout.
export default function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-accent" />
      <span className="eyebrow">{children}</span>
    </div>
  )
}
