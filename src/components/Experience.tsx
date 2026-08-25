import { motion, useReducedMotion } from 'motion/react'
import { experience, type ExperienceEntry } from '../data/experience'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'
import Tag from './Tag'

// Process facts, not outcome facts — Projects' Fig. 1 artifact already
// carries the accuracy/F1 result, so this ledger is free to describe
// the work that produced it: real counts pulled straight from the
// entry's own description, not re-derived or invented.
const ALGOVERSE_LEDGER = [
  { value: '05', label: 'Iteration rounds' },
  { value: '600', label: 'Sample dataset' },
  { value: '02', label: 'Models evaluated' },
  { value: '02', label: 'Workshops accepted' },
]

// The paper's actual method comparison (arXiv:2507.13357, Fig. 2): F1
// per model across baseline, the two 8/10-shot prompting techniques the
// paper names MWA and USA, and their combination. n=600 matches the
// 311 curated benign + 289 phishing brands the paper evaluates on.
const PAPER_RESULTS = [
  { method: 'Baseline', gpt4o: 0.91, gemini: 0.81 },
  { method: 'MWA', gpt4o: 0.84, gemini: 0.9 },
  { method: 'USA', gpt4o: 0.91, gemini: 0.87 },
  { method: 'Combined', gpt4o: 0.93, gemini: 0.91 },
]
const SCALE_MIN = 0.7
const SCALE_MAX = 0.95
function barHeight(f1: number) {
  return ((f1 - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100
}

// Byline in real citation order (first four authors, then et al.) — the
// same shorthand a reader would see on the paper's own venue listing.
const PAPER_TITLE =
  'Adaptive Linguistic Prompting (ALP) Enhances Phishing Webpage Detection in Multimodal Large Language Models'
const PAPER_BYLINE = 'Bhargude, Gonehal, Haney, Yoon, et al.'

function PaperFigure({ link, linkLabel }: { link?: string; linkLabel?: string }) {
  return (
    <div className="w-full max-w-xl border border-ink-700 bg-ink-900 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <div className="flex flex-col gap-4 border-b border-ink-800 p-6 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
            Published research
          </span>
          <p className="mt-2 max-w-md font-sans text-lg leading-snug text-paper sm:text-xl">{PAPER_TITLE}</p>
          <p className="mt-2 font-mono text-[0.625rem] tracking-wide text-paper-dim uppercase">{PAPER_BYLINE}</p>
        </div>
        <span className="inline-flex w-fit shrink-0 rounded-[3px] border border-accent/50 px-2 py-1 font-mono text-[0.5625rem] tracking-[0.12em] text-accent uppercase">
          NLP4PI 2025
        </span>
      </div>

      <figure className="p-6">
        <figcaption className="font-mono text-[0.625rem] tracking-[0.12em] text-paper-dim uppercase">
          Fig. 2 · F1 by method (n=600)
        </figcaption>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {PAPER_RESULTS.map((row) => (
            <div key={row.method} className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="font-mono text-[0.5625rem] tabular text-accent">{row.gpt4o.toFixed(2)}</span>
                  <div className="flex h-28 w-3.5 items-end bg-ink-800">
                    <div className="w-full bg-accent" style={{ height: `${barHeight(row.gpt4o)}%` }} />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="font-mono text-[0.5625rem] tabular text-paper-dim">{row.gemini.toFixed(2)}</span>
                  <div className="flex h-28 w-3.5 items-end bg-ink-800">
                    <div className="w-full bg-paper-dim/50" style={{ height: `${barHeight(row.gemini)}%` }} />
                  </div>
                </div>
              </div>
              <span className="font-mono text-[0.5625rem] tracking-wide text-paper-dim uppercase">{row.method}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-ink-800 pt-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] text-paper-dim uppercase">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
              GPT-4o
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] text-paper-dim uppercase">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-paper-dim/50" />
              Gemini 1.5 Pro
            </span>
          </div>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium tracking-wide text-accent uppercase transition-colors hover:text-paper"
            >
              {linkLabel ?? 'Read Paper'}
              <span aria-hidden="true" className="text-[0.625rem]">
                ↗
              </span>
            </a>
          )}
        </div>
      </figure>
    </div>
  )
}

function AlgoverseEntry({ entry, prefersReducedMotion }: { entry: ExperienceEntry; prefersReducedMotion: boolean }) {
  return (
    <motion.div
      className="lg:col-span-8"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32, rotate: -0.4 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs tracking-wide text-paper-dim tabular uppercase">{entry.dates}</span>
        {entry.stat && (
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-accent uppercase">{entry.stat}</span>
        )}
      </div>
      <h3 className="mt-2 font-display text-4xl leading-[0.95] font-bold uppercase tracking-tight text-paper sm:text-6xl">
        {entry.company}
      </h3>
      <p className="mt-2 text-sm font-medium text-accent">{entry.role}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim">{entry.description}</p>

      <div className="mt-6">
        <PaperFigure link={entry.link} linkLabel={entry.linkLabel} />
      </div>

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink-800 pt-6">
        {ALGOVERSE_LEDGER.map((item) => (
          <div key={item.label}>
            <p className="font-display text-3xl font-bold tabular text-paper">{item.value}</p>
            <p className="font-mono text-[0.625rem] tracking-[0.1em] text-paper-dim uppercase">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-xl border-l-2 border-accent pl-4 text-sm leading-relaxed text-paper-dim">
        A <span className="font-medium text-paper">"suspicious-first" heuristic</span> I devised for reading a
        page's structure before its content carried accuracy from 81% to 91%.
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {entry.tags.map((tag, index) => (
          <Tag key={tag} label={tag} delay={index * 30} />
        ))}
      </ul>
    </motion.div>
  )
}

function HandshakeEntry({ entry, prefersReducedMotion }: { entry: ExperienceEntry; prefersReducedMotion: boolean }) {
  return (
    <motion.div
      className="lg:col-span-4 lg:col-start-9 lg:mt-14"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
    >
      <span className="font-mono text-xs tracking-wide text-paper-dim tabular uppercase">{entry.dates}</span>
      <p className="mt-2 text-lg font-semibold text-accent sm:text-xl">{entry.role}</p>
      <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-paper sm:text-3xl">
        {entry.company}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-paper-dim">{entry.description}</p>

      <div className="mt-6">
        <span className="font-display text-2xl font-bold tabular text-accent">{entry.stat}</span>
        <div className="mt-2 h-px w-full bg-accent/30" aria-hidden="true" />
        <p className="mt-2 font-mono text-[0.625rem] tracking-wide text-paper-dim/60 uppercase">
          Audio · Image · Text
        </p>
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {entry.tags.map((tag, index) => (
          <Tag key={tag} label={tag} delay={index * 30} />
        ))}
      </ul>
    </motion.div>
  )
}

export default function Experience() {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const algoverse = experience.find((e) => e.company === 'Algoverse AI Research')!
  const handshake = experience.find((e) => e.company === 'Handshake')!

  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12">
      <Eyebrow>Work</Eyebrow>
      <MaskReveal className="mt-2 w-fit">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
          Experience
        </h2>
      </MaskReveal>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12">
        <AlgoverseEntry entry={algoverse} prefersReducedMotion={prefersReducedMotion} />
        <HandshakeEntry entry={handshake} prefersReducedMotion={prefersReducedMotion} />
      </div>
    </section>
  )
}
