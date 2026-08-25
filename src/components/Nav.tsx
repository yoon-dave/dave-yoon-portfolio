import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#education', label: 'Education', id: 'education' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#projects', label: 'Projects', id: 'projects' },
  { href: '#contact', label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const sections = [{ id: 'home' }, ...links]
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = linkRefs.current[active]
    if (node) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth })
    } else {
      setUnderline({ left: 0, width: 0 })
    }
  }, [active])

  useEffect(() => {
    setMenuOpen(false)
  }, [active])

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <a
          href="#home"
          className="shrink-0 font-display text-lg font-bold uppercase tracking-wide text-paper transition-colors duration-200 hover:text-accent"
        >
          Dave Yoon
        </a>
        <ul className="relative hidden shrink-0 gap-7 font-mono text-xs tracking-[0.1em] text-paper-dim uppercase sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                ref={(node) => {
                  linkRefs.current[link.id] = node
                }}
                href={link.href}
                className={`block py-1 whitespace-nowrap transition-colors duration-200 ${
                  active === link.id ? 'text-paper' : 'hover:text-paper'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <span
            className="absolute -bottom-1 h-[2px] bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ left: underline.left, width: underline.width }}
          />
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-[5px] sm:hidden"
        >
          <span
            className={`h-px w-5 bg-paper transition-transform duration-200 ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`}
          />
          <span
            className={`h-px w-5 bg-paper transition-transform duration-200 ${menuOpen ? '-rotate-45' : ''}`}
          />
        </button>
      </nav>

      {menuOpen && (
        <ul className="border-t border-ink-800 font-mono text-sm tracking-[0.08em] text-paper-dim uppercase sm:hidden">
          {links.map((link) => (
            <li key={link.href} className="border-b border-ink-800">
              <a
                href={link.href}
                className={`block px-6 py-4 transition-colors duration-200 ${
                  active === link.id ? 'text-accent' : 'hover:text-paper'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
