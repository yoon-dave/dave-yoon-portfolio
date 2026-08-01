export interface Project {
  title: string
  description: string
  tags: string[]
  link?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'GymBud',
    description:
      "An iOS fitness app I designed, built, and shipped solo to the App Store, using Swift and SwiftUI with an MVVM architecture. It has a drag-and-drop workout builder, full CRUD session tracking, and Swift Charts for visualizing progress over time.",
    tags: ['Swift', 'SwiftUI', 'MVVM', 'iOS'],
  },
  {
    title: 'Phishing Detection via Adaptive Linguistic Prompting',
    description:
      'Co-authored a paper accepted to NLP4PI and WOAH 2025. I built a few-shot prompting framework (ALP) and tested it on GPT-4o and Gemini 1.5 against zero-day phishing pages, combining HTML parsing with vision analysis to hit a 0.93 F1-score.',
    tags: ['LLM Prompting', 'GPT-4o', 'Gemini 1.5', 'Research'],
  },
  {
    title: 'T-Mobile AI Pricing Assistant (DubHacks 2025)',
    description:
      "Built with a 4-person team in 24 hours. A React and Python full-stack app with a Gemini 1.5 Pro chatbot for dynamic pricing, running as a working prototype on a Raspberry Pi 5 modeling T-Mobile's 5G Home Internet gateway.",
    tags: ['React', 'Python', 'Gemini 1.5 Pro', 'Raspberry Pi'],
  },
  {
    title: 'Rainwater Conservation Display',
    description:
      "An interactive Next.js exhibit built for Engineers Without Borders, visualizing UW's rainwater harvesting system with Tailwind CSS and live rainfall and storage sensor data, made for public sustainability education.",
    tags: ['Next.js', 'Tailwind CSS', 'Data Viz'],
  },
]
