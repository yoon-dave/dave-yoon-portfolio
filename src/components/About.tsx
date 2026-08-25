import { useReveal } from '../hooks/useReveal'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'
import Tag from './Tag'

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Java', 'Python', 'C', 'C++', 'Assembly', 'JavaScript', 'TypeScript', 'Swift'],
  },
  {
    label: 'Frameworks / Tools',
    skills: [
      'React',
      'SwiftUI',
      'Combine',
      'Git',
      'Docker',
      'Tailwind CSS',
      'Node.js',
      'Next.js',
      'Vite',
      'FastAPI',
      'Gemini',
      'PostgreSQL',
      'GitHub App',
    ],
  },
  {
    label: 'Concepts',
    skills: [
      'Object-Oriented Programming',
      'Full-Stack Development',
      'MVVM Architecture',
      'RESTful APIs',
      'Serverless Functions',
      'CI/CD',
      'UI/UX',
      'Data Structures',
      'Version Control',
    ],
  },
  {
    label: 'Problem Solving',
    skills: ['150+ LeetCode Problems Solved'],
  },
]

export default function About() {
  const gpa = useReveal<HTMLDivElement>(100)

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12">
      <Eyebrow>Profile</Eyebrow>

      <MaskReveal className="mt-6 max-w-3xl">
        <p className="font-display text-3xl leading-[1.15] font-bold text-paper sm:text-4xl">
          I like building things end to end, from the prompting research
          behind a published phishing-detection paper to GymBud, an iOS
          fitness app I designed and shipped solo to the App Store.
        </p>
      </MaskReveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_240px] lg:gap-16">
        <div>
          <p className="max-w-2xl text-base leading-relaxed text-paper-dim">
            I'm a Computer Science student at the University of
            Washington, minoring in Business Administration. Lately I've
            been deep in AI tooling and full-stack systems, most recently
            building Codelens, an AI-powered code review platform.
          </p>

          <div className="mt-12 space-y-6">
            {skillGroups.map((group, groupIndex) => (
              <div key={group.label} className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <span className="eyebrow w-40 shrink-0 pt-1">{group.label}</span>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {group.skills.map((skill, index) => (
                    <Tag key={skill} label={skill} delay={groupIndex * 80 + index * 30} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div ref={gpa.ref} className={`lg:pt-1 ${gpa.className}`} style={gpa.style}>
          <span className="eyebrow">GPA</span>
          <p className="mt-1 font-display text-6xl font-bold tabular text-paper">3.98</p>
          <p className="font-mono text-xs text-paper-dim">/ 4.00</p>
          <p className="mt-6 text-sm leading-relaxed text-paper-dim">
            B.S. Computer Science, minor in Business Administration —
            Allen School of Computer Science &amp; Foster School of
            Business.
          </p>
        </div>
      </div>
    </section>
  )
}
