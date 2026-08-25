import { MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import TitleBlock from './components/TitleBlock'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-ink-950 text-paper">
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>
        <TitleBlock />
        <ScrollToTop />
      </div>
    </MotionConfig>
  )
}

export default App
