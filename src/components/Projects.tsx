import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { projects } from '../data/projects'
import Tag from './Tag'
import CircleReveal from './CircleReveal'
import CodelensArtifact from './projects/CodelensArtifact'
import GymBudArtifact from './projects/GymBudArtifact'
import DubHacksArtifact from './projects/DubHacksArtifact'
import PlatformerArtifact from './projects/PlatformerArtifact'
import ThyrdArtifact from './projects/ThyrdArtifact'

const platformer = projects.find((p) => p.title === 'Learning to Jump')!
const codelens = projects.find((p) => p.title === 'Codelens')!
const gymbud = projects.find((p) => p.title === 'GymBud')!
const thyrd = projects.find((p) => p.title === 'Thyrd')!
const dubhacks = projects.find((p) => p.title === 'T-Mobile AI Pricing Assistant')!

function ExhibitItem({
  className,
  artifact,
  eyebrow,
  title,
  description,
  tags,
  statText,
  link,
  linkLabel,
  delay,
}: {
  className: string
  artifact: ReactNode
  eyebrow: string
  title: string
  description: string
  tags: string[]
  statText?: string
  link?: string
  linkLabel?: string
  delay: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`relative ${className}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40, rotate: -0.6 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 17, delay }}
    >
      <div className="flex [&>*]:h-full [&>*]:w-full [&>*]:max-w-none">{artifact}</div>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3
          className='mt-2 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl'
        >
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-paper-dim">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {tags.map((tag, i) => (
            <Tag key={tag} label={tag} delay={i * 30} />
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-6 text-xs">
          {statText && <span className="text-accent">{statText}</span>}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-paper transition-colors hover:text-accent"
            >
              {linkLabel ?? 'View'}
              <span aria-hidden="true" className="text-[0.6875rem]">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {

  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12"
    >

      <CircleReveal>
        <h2 className="relative mt-2 font-display text-4xl font-semibold tracking-tight text-paper sm:text-4xl">
          Projects
        </h2>

        {/* Even grid, two per row. Each card spans two subgrid rows (artifact, text),
            so artifacts in a row share a height and the titles line up. */}
        <div className="relative mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12">
          <ExhibitItem
            className="grid grid-rows-subgrid row-span-2 gap-6"
            artifact={<ThyrdArtifact />}
            eyebrow={thyrd.code}
            title={thyrd.title}
            description={thyrd.description}
            tags={thyrd.tags}
            statText="183 Tests"
            link={thyrd.link}
            linkLabel={thyrd.linkLabel}
            delay={0}
          />
          <ExhibitItem
            className="grid grid-rows-subgrid row-span-2 gap-6"
            artifact={<CodelensArtifact />}
            eyebrow={codelens.code}
            title={codelens.title}
            description={codelens.description}
            tags={codelens.tags}
            statText="150+ Tests"
            link={codelens.link}
            linkLabel="Live site"
            delay={0}
          />
          <ExhibitItem
            className="grid grid-rows-subgrid row-span-2 gap-6"
            artifact={<PlatformerArtifact />}
            eyebrow={platformer.code}
            title={platformer.title}
            description={platformer.description}
            tags={platformer.tags}
            statText="100% Solved"
            link={platformer.link}
            linkLabel={platformer.linkLabel}
            delay={0}
          />
          <ExhibitItem
            className="grid grid-rows-subgrid row-span-2 gap-6"
            artifact={<GymBudArtifact />}
            eyebrow={gymbud.code}
            title={gymbud.title}
            description={gymbud.description}
            tags={gymbud.tags}
            link={gymbud.link}
            linkLabel={gymbud.linkLabel}
            delay={0}
          />
          <ExhibitItem
            className="grid grid-rows-subgrid row-span-2 gap-6"
            artifact={<DubHacksArtifact />}
            eyebrow={dubhacks.code}
            title={dubhacks.title}
            description={dubhacks.description}
            tags={dubhacks.tags}
            statText="3rd Place"
            delay={0}
          />
        </div>

        <p className="relative mt-24 text-xs text-paper-dim/60">
          This site is React, TypeScript, Vite and Tailwind CSS, with Resend for the contact form.
        </p>
      </CircleReveal>
    </section>
  )
}
