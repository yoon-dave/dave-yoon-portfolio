import { useReveal } from '../hooks/useReveal'

interface SkillPillProps {
  skill: string
  delay?: number
}

export default function SkillPill({ skill, delay = 0 }: SkillPillProps) {
  const reveal = useReveal<HTMLLIElement>(delay)

  return (
    <li
      ref={reveal.ref}
      className={`rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-indigo-400 ${reveal.className}`}
      style={reveal.style}
    >
      {skill}
    </li>
  )
}
