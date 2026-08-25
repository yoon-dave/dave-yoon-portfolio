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
import GlobalGrid from './components/GlobalGrid'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-svh bg-ink-950 text-paper">
        <GlobalGrid />
        <ScrollProgress />
        <Nav />
        <main className="relative z-10">
          <Hero />
          <About />
          <Education />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <TitleBlock />
        <ScrollToTop />
      </div>
    </MotionConfig>
  )
}

export default App
