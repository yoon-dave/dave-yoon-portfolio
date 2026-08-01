import { useReveal } from '../hooks/useReveal'
import { education, type EducationEntry } from '../data/education'
import SectionHeading from './SectionHeading'

function EducationCard({ entry, delay }: { entry: EducationEntry; delay: number }) {
  const reveal = useReveal<HTMLDivElement>(delay)

  return (
    <div
      ref={reveal.ref}
      className={`rounded-2xl border border-slate-200 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/40 ${reveal.className}`}
      style={reveal.style}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {entry.school}
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-500">
          {entry.location}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {entry.detail}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
        {entry.dates}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Relevant coursework: {entry.coursework}
      </p>
    </div>
  )
}

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading number="02" title="Education" />
      <div className="mt-10 flex flex-col gap-6">
        {education.map((entry, index) => (
          <EducationCard key={entry.school} entry={entry} delay={index * 120} />
        ))}
      </div>
    </section>
  )
}
