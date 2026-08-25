export interface Project {
  title: string
  code: string
  description: string
  tags: string[]
  stat?: string
  statNumber?: number
  statSuffix?: string
  link?: string
  linkLabel?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'Codelens',
    code: 'AI Code Review Platform · Independent',
    description:
      'A full-stack AI code review platform that analyzes GitHub pull requests and returns structured findings: severity, category, explanation, and suggested fix. The review pipeline is provider-agnostic, built on Gemini with Pydantic-validated schemas, async processing, and content-hash caching that skips redundant analysis of identical diffs. A least-privilege GitHub App pulls repos, PRs, and diffs without persisting access tokens.',
    tags: ['Next.js', 'Gemini', 'Pydantic', 'Clerk', 'GitHub App'],
    statNumber: 150,
    statSuffix: '+ Tests',
    link: 'https://codelens-web-pi.vercel.app',
  },
  {
    title: 'GymBud',
    code: 'iOS · Founder & Developer',
    description:
      'An iOS fitness app I designed, developed, and shipped independently to the App Store, using Swift, SwiftUI, and MVVM. The UI is state-driven with Combine, supporting drag-and-drop reordering and full CRUD over exercises within workout splits. A Codable/JSON persistence layer tracks calendar-aware progress, and Swift Charts visualize performance history.',
    tags: ['Swift', 'SwiftUI', 'Combine', 'MVVM'],
    statNumber: 943,
    statSuffix: '+ Users',
    link: 'https://apps.apple.com/us/app/gymbud-fitness-tracker/id6751370702',
    linkLabel: 'App Store',
  },
  {
    title: 'T-Mobile AI Pricing Assistant',
    code: 'DubHacks 2025 · 3rd Place, Category Winner',
    description:
      "Built the Python backend for a 4-person, interdisciplinary team at DubHacks, a 24-hour collegiate hackathon. Integrated Gemini 1.5 Pro for real-time pricing and inventory reasoning over live sales data, and deployed the working prototype on a Raspberry Pi 5 modeling T-Mobile's 5G Home Internet gateway.",
    tags: ['Python', 'Gemini 1.5 Pro', 'Raspberry Pi'],
    stat: '3rd Place',
  },
  {
    title: 'Personal Portfolio Website',
    code: 'Independent Project',
    description:
      'This site is built with React 19, TypeScript, Vite, and Tailwind CSS v4, and deployed on Vercel. A working contact form is backed by a Vercel serverless function that sends email through the Resend API.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Resend'],
  },
]
