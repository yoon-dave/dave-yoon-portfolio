import type { ReactNode } from 'react'

// Small label above a heading. Kept quiet on purpose: sentence case, no
// decorative mark.
export default function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}
