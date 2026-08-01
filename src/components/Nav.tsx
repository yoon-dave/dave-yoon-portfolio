import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '#home', label: 'Home', id: 'home' },
  { href: '#about', label: 'About', id: 'about' },
  { href: '#education', label: 'Education', id: 'education' },
  { href: '#projects', label: 'Projects', id: 'projects' },
  { href: '#contact', label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [active, setActive] = useState('home')
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const sections = links
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
    }
  }, [active])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 overflow-x-auto px-6 py-4">
        <a
          href="#home"
          className="shrink-0 text-sm font-semibold tracking-tight text-slate-900 transition-colors duration-300 hover:text-indigo-500 dark:text-white dark:hover:text-indigo-400"
        >
          Dave Yoon
        </a>
        <ul className="relative flex shrink-0 gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          {links.map((link) => (
            <li key={link.href}>
              <a
                ref={(node) => {
                  linkRefs.current[link.id] = node
                }}
                href={link.href}
                className={`block whitespace-nowrap py-1 transition-colors ${
                  active === link.id
                    ? 'text-slate-900 dark:text-white'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <span
            className="absolute -bottom-1 h-0.5 rounded-full bg-indigo-500 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ left: underline.left, width: underline.width }}
          />
        </ul>
      </nav>
    </header>
  )
}
