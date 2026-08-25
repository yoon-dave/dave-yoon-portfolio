export interface ExperienceEntry {
  company: string
  location: string
  role: string
  code: string
  dates: string
  description: string
  stat?: string
  tags: string[]
  link?: string
  linkLabel?: string
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Algoverse AI Research',
    location: 'Remote',
    role: 'AI Research Prompt Engineer',
    code: "Research · NLP4PI + WOAH '25",
    dates: 'October 2024 – June 2025',
    description:
      'Co-authored "Adaptive Linguistic Prompting Enhances Phishing Webpage Detection in Multimodal LLMs," accepted to NLP4PI and WOAH 2025 (ACL workshops). I iterated an 8-shot prompting framework across five rounds for GPT-4o and Gemini 1.5 Pro and built the 600-sample multimodal dataset behind the evaluation. A "suspicious-first" heuristic I devised raised URL-based detection accuracy from 81% to 91%, pushing the F1-score to 0.93 on GPT-4o with a 10-point gain on Gemini 1.5 Pro.',
    stat: 'Published',
    tags: ['GPT-4o', 'Gemini 1.5 Pro', 'Prompt Engineering'],
    link: 'https://www.semanticscholar.org/paper/Adaptive-Linguistic-Prompting-(ALP)-Enhances-in-Bhargude-Gonehal/e9129e52d36b5ed4908c2547c7f56d93c4816ae6',
    linkLabel: 'Read Paper',
  },
  {
    company: 'Handshake',
    location: 'Sammamish, WA',
    role: 'AI Training Intern',
    code: 'Paid AI Training Program',
    dates: 'July 2025 – November 2025',
    description:
      'Ranked and evaluated multimodal AI model outputs (audio, image, and text) using RLHF-style comparison and preference labeling. I also wrote corrected reference answers and gold-standard labels to support supervised fine-tuning, and kept a personal quality score above 94%.',
    stat: '94%+ Quality',
    tags: ['RLHF', 'Preference Labeling', 'SFT Data'],
  },
]
