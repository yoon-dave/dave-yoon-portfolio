import type { ReactNode } from 'react'

// Used to be a scroll-linked wipe. Headings now just sit on the page.
export default function MaskReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
