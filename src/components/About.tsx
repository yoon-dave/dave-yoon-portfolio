const skillGroups = [
  { label: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'C++', 'Assembly', 'Swift'] },
  {
    label: 'Web and backend',
    skills: ['React', 'Next.js', 'Node.js', 'FastAPI', 'Pydantic', 'PostgreSQL', 'Docker', 'Git', 'Tailwind CSS', 'Vite'],
  },
  { label: 'Embedded and systems', skills: ['Embedded Linux', 'ARM (BeagleBone Black)', 'Make'] },
  { label: 'Mobile', skills: ['SwiftUI', 'Combine', 'Flutter', 'Dart', 'Xcode', 'Android Studio'] },
  { label: 'AI/ML', skills: ['Gemini API', 'GPT-4o', 'Prompt engineering', 'NLP', 'NumPy'] },
]

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">Things I use</h2>
      <dl className="mt-8 max-w-3xl divide-y divide-ink-800 border-y border-ink-800">
        {skillGroups.map((group) => (
          <div key={group.label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="text-sm font-medium text-paper">{group.label}</dt>
            <dd className="text-sm leading-relaxed text-paper-dim">{group.skills.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
