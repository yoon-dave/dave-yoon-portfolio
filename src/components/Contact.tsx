import { useState, type FormEvent } from 'react'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'

const CONTACT_EMAIL = 'dgyoon@cs.washington.edu'
const CONTACT_PHONE = '(425) 365-2019'
const CONTACT_PHONE_TEL = '+14253652019'
const GITHUB_URL = 'https://github.com/yoon-dave'
const LINKEDIN_URL = 'https://www.linkedin.com/in/dgyoon/'

const fieldClass =
  'peer w-full border-b border-ink-700 bg-transparent px-0 pt-5 pb-2 text-sm text-paper outline-none transition-colors focus:border-accent'
const labelClass =
  'pointer-events-none absolute left-0 top-3.5 font-mono text-xs tracking-wide text-paper-dim uppercase transition-all duration-200 peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:text-accent peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-[0.6875rem]'

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
      className="link-underline transition-colors hover:text-accent"
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
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12">
      <Eyebrow>Reach</Eyebrow>
      <MaskReveal className="mt-6 max-w-2xl">
        <p className="font-display text-3xl leading-[1.2] font-bold text-paper sm:text-4xl">
          Based in Sammamish, WA. Have a project in mind or just want to
          say hi?
        </p>
      </MaskReveal>
      <p className="mt-4 max-w-md text-base leading-relaxed text-paper-dim">
        Fill out the form and it'll land straight in my inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex max-w-xl flex-col gap-7">
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
            rows={4}
            placeholder=" "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={fieldClass}
          />
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
        </div>
        <div className="mt-2 flex items-center gap-5">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-fit rounded-[3px] bg-paper px-6 py-3 font-mono text-xs font-medium tracking-[0.08em] text-ink-950 uppercase transition-colors duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'success' && (
            <span className="font-mono text-xs text-paper-dim">
              Message sent — I'll get back to you soon.
            </span>
          )}
          {status === 'error' && (
            <span className="font-mono text-xs text-accent">
              Something went wrong. Try emailing me directly instead.
            </span>
          )}
        </div>
      </form>

      <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink-800 pt-8 font-mono text-xs tracking-wide text-paper-dim uppercase">
        <CopyableLink value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} display={CONTACT_EMAIL} />
        <CopyableLink value={CONTACT_PHONE} href={`tel:${CONTACT_PHONE_TEL}`} display={CONTACT_PHONE} />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="link-underline inline-flex items-center gap-1.5 transition-colors hover:text-accent"
        >
          GitHub
          <span aria-hidden="true" className="text-[0.6875rem]">
            ↗
          </span>
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="link-underline inline-flex items-center gap-1.5 transition-colors hover:text-accent"
        >
          LinkedIn
          <span aria-hidden="true" className="text-[0.6875rem]">
            ↗
          </span>
        </a>
        <span>Sammamish, WA</span>
      </div>
    </section>
  )
}
