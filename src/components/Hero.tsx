const LINKS = [
  { label: 'Email', href: 'mailto:dgyoon@cs.washington.edu' },
  { label: 'GitHub', href: 'https://github.com/yoon-dave' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dgyoon/' },
]

const NOW = [
  { what: 'Software engineer, star tracker team', where: 'Husky Satellite Lab' },
  { what: 'Building Thyrd, a campus events app', where: 'thyrd-theta.vercel.app' },
  { what: 'CS + Business minor, class of 2028', where: 'University of Washington' },
]

export default function Hero() {
  return (
    <section id="home" className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16 sm:px-8 sm:pt-32 lg:px-12">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight text-paper sm:text-6xl">
          Hi, I’m Dave.
        </h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-paper-dim">
          <p>I’m a computer science student at UW’s Allen School.</p>
          <p>
            Right now I’m writing <span className="marker text-paper">star-tracking software for CubeSats</span> at
            Husky Satellite Lab and building
            Thyrd, an app for finding things to do around campus and people to do them with. Before that, I
            shipped an iOS app that’s reached 950+ users and co-authored a paper on catching phishing websites
            with LLMs.
          </p>
        </div>

        <ul className="mt-10 divide-y divide-ink-800 border-y border-ink-800">
          {NOW.map((item) => (
            <li key={item.what} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-paper">{item.what}</span>
              <span className="text-sm text-paper-dim">{item.where}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#projects"
            onClick={(e) => {
              // Glide down instead of jumping, even where CSS smooth scrolling is off.
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              history.replaceState(null, '', '#projects')
            }}
            className="rounded-md bg-paper px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-accent"
          >
            See my projects
          </a>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
