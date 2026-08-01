import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import AmbientBackground from './components/AmbientBackground'

function App() {
  return (
    <div className="min-h-svh text-slate-700 dark:text-slate-300">
      <AmbientBackground />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} Dave Yoon. Built with React & Tailwind CSS.
      </footer>
      <ScrollToTop />
    </div>
  )
}

export default App
