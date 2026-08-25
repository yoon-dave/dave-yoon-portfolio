import type { CSSProperties } from 'react'

interface DimensionLineProps {
  className?: string
  style?: CSSProperties
}

export default function DimensionLine({ className = '', style }: DimensionLineProps) {
  return (
    <div className={`flex items-center ${className}`} style={style} aria-hidden="true">
      <span className="h-2 w-px bg-ink-600" />
      <span className="h-px flex-1 bg-ink-700" />
      <span className="h-2 w-px bg-ink-600" />
    </div>
  )
}
