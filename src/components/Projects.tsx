import { useReveal } from '../hooks/useReveal'
import { projects, type Project } from '../data/projects'
import SectionHeading from './SectionHeading'

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const reveal = useReveal<HTMLElement>(delay)

  return (
    <article
      ref={reveal.ref}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/40 ${reveal.className}`}
      style={reveal.style}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-y-0 left-0 w-1/3 -translate-x-[200%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[500%] motion-reduce:hidden dark:via-white/10" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {project.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
          >
            {tag}
          </li>
        ))}
      </ul>
      {(project.link || project.repo) && (
        <div className="mt-5 flex gap-4 text-sm font-medium">
          {project.link && (
            <a
              href={project.link}
              className="link-underline text-indigo-600 dark:text-indigo-400"
            >
              Live site
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              className="link-underline text-slate-600 dark:text-slate-400"
            >
              Source
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading number="03" title="Projects" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} delay={index * 100} />
        ))}
      </div>
    </section>
  )
}
