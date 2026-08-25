import { useReveal } from '../hooks/useReveal'

interface TagProps {
  label: string
  delay?: number
}

export default function Tag({ label, delay = 0 }: TagProps) {
  const reveal = useReveal<HTMLLIElement>(delay)

  return (
    <li
      ref={reveal.ref}
      className={`border-b border-ink-700 pb-1 font-mono text-xs tracking-wide text-paper-dim transition-colors duration-200 hover:border-accent hover:text-paper ${reveal.className}`}
      style={reveal.style}
    >
      {label}
    </li>
  )
}
