import { useReveal } from '../hooks/useReveal'
import SectionHeading from './SectionHeading'
import SkillPill from './SkillPill'

const skills = [
  'Python',
  'Java',
  'C',
  'C++',
  'JavaScript',
  'Swift',
  'Assembly',
  'Git',
  'Android Studio',
  'CAD',
  'CSS',
  'Tailwind',
  'OOP',
  'Full Stack',
]

export default function About() {
  const bio = useReveal<HTMLParagraphElement>(100)

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading number="01" title="About" />
      <p
        ref={bio.ref}
        className={`mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 ${bio.className}`}
        style={bio.style}
      >
        I'm a Computer Science student at the University of Washington with a
        4.0 GPA. Right now I'm an AI Training Intern at Handshake, where I
        validate multimodal datasets across audio, vision, and NLP
        pipelines. Outside of that, I co-authored a paper on phishing
        detection that got accepted to NLP4PI and WOAH 2025, and I designed,
        built, and shipped GymBud, an iOS fitness app that's live on the App
        Store. I like working across the whole stack, from research down to
        something people can actually use.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <SkillPill key={skill} skill={skill} delay={150 + index * 40} />
        ))}
      </ul>
    </section>
  )
}
