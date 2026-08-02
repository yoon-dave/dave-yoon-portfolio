import { useState, type FormEvent } from 'react'
import SectionHeading from './SectionHeading'

const CONTACT_EMAIL = 'dgyoon@cs.washington.edu'
const CONTACT_PHONE = '(425) 365-2019'
const CONTACT_PHONE_TEL = '+14253652019'
const GITHUB_URL = 'https://github.com/yoon-dave'
const LINKEDIN_URL = 'https://www.linkedin.com/in/dgyoon/'

const fieldClass =
  'peer w-full rounded-lg border border-slate-300 bg-white/60 px-4 pt-5 pb-2 text-sm outline-none backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900/50'
const labelClass =
  'pointer-events-none absolute left-4 top-3.5 text-sm text-slate-500 transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs dark:text-slate-400'

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

function CopyableLink({ value, href, display }: { value: string; href: string; display: string }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the mailto/tel
      // href still gives the browser a shot at opening a handler.
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="link-underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
    >
      {copied ? 'Copied to clipboard' : display}
    </a>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading number="04" title="Contact" />
      <p className="mt-6 max-w-xl text-slate-600 dark:text-slate-300">
        Based in Sammamish, WA. Have a project in mind or just want to say
        hi? Fill out the form and it'll land straight in my inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-5">
        <div className="relative">
          <input
            id="name"
            type="text"
            required
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
        </div>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
        </div>
        <div className="relative">
          <textarea
            id="message"
            required
            rows={5}
            placeholder=" "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={fieldClass}
          />
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="group relative isolate w-fit overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-slate-700 hover:shadow-[0_0_24px_-4px_rgba(99,102,241,0.6)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[400%] motion-reduce:hidden dark:via-white/50" />
            <span className="relative">{status === 'sending' ? 'Sending…' : 'Send message'}</span>
          </button>
          {status === 'success' && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Message sent — I'll get back to you soon.
            </span>
          )}
          {status === 'error' && (
            <span className="text-sm text-rose-600 dark:text-rose-400">
              Something went wrong. Try emailing me directly instead.
            </span>
          )}
        </div>
      </form>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        <CopyableLink value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} display={CONTACT_EMAIL} />
        <CopyableLink value={CONTACT_PHONE} href={`tel:${CONTACT_PHONE_TEL}`} display={CONTACT_PHONE} />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="link-underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          GitHub
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="link-underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          LinkedIn
        </a>
        <span>Sammamish, WA</span>
      </div>
    </section>
  )
}
