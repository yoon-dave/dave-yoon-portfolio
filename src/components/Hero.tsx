export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[90svh] items-center overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-32">
        <p
          className="animate-hero-in font-mono text-sm font-medium tracking-widest text-indigo-500 dark:text-indigo-400"
          style={{ animationDelay: '0ms' }}
        >
          00 / Hi, I'm
        </p>
        <h1
          className="name-gradient animate-hero-in mt-4 text-5xl font-semibold tracking-tight sm:text-6xl"
          style={{ animationDelay: '120ms' }}
        >
          Dave Yoon
        </h1>
        <p
          className="animate-hero-in mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400"
          style={{ animationDelay: '240ms' }}
        >
          I'm a CS student at the University of Washington who likes
          shipping real projects, from AI research tools to iOS apps to
          full-stack products.
        </p>
        <div className="animate-hero-in mt-8 flex gap-4" style={{ animationDelay: '360ms' }}>
          <a
            href="#projects"
            className="group relative isolate overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-slate-700 hover:shadow-[0_0_24px_-4px_rgba(99,102,241,0.6)] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[400%] motion-reduce:hidden dark:via-white/50" />
            <span className="relative">View my work</span>
          </a>
          <a
            href="#contact"
            className="group relative isolate overflow-hidden rounded-full border border-slate-300 bg-white/50 px-6 py-3 text-sm font-medium text-slate-700 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-indigo-400 hover:shadow-[0_0_20px_-6px_rgba(99,102,241,0.45)] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-indigo-400"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[400%] motion-reduce:hidden dark:via-indigo-300/25" />
            <span className="relative">Get in touch</span>
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-slate-400 transition-colors hover:text-slate-600 motion-reduce:animate-none sm:block dark:text-slate-600 dark:hover:text-slate-400"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  )
}
