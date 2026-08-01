import { useReveal } from '../hooks/useReveal'

interface SectionHeadingProps {
  number: string
  title: string
}

export default function SectionHeading({ number, title }: SectionHeadingProps) {
  const reveal = useReveal<HTMLDivElement>()

  return (
    <div ref={reveal.ref} className={reveal.className} style={reveal.style}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-indigo-500 dark:text-indigo-400">
          {number}
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div
        className="mt-4 h-px w-full origin-left bg-gradient-to-r from-indigo-500/60 via-slate-300 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:via-slate-700"
        style={{ transform: reveal.visible ? 'scaleX(1)' : 'scaleX(0)' }}
      />
    </div>
  )
}
