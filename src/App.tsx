import { MotionConfig } from 'motion/react'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'
import ScrollToTop from './components/ScrollToTop'
import DotGrid from './components/DotGrid'

function App() {
  return (
    // "always" turns off the slide/scale entrance animations site-wide;
    // opacity fades and the interactive figures still work.
    <MotionConfig reducedMotion="always">
      <div className="relative min-h-svh bg-ink-950 text-paper">
        <DotGrid />
        <main className="relative z-10">
          <Hero />
          <Experience />
          <Projects />
          <About />
          <Education />
          <Contact />
        </main>
        <ScrollToTop />
      </div>
    </MotionConfig>
  )
}

export default App
