export interface EducationEntry {
  school: string
  location: string
  detail: string
  dates: string
  coursework: string
}

export const education: EducationEntry[] = [
  {
    school: 'University of Washington',
    location: 'Seattle, WA',
    detail: 'B.S. in Computer Science, GPA 4.0/4.0',
    dates: 'September 2025 to June 2028',
    coursework:
      'Calculus I to III, Software Design & Implementation, Hardware/Software Interface',
  },
  {
    school: 'Skyline High School',
    location: 'Sammamish, WA',
    detail: 'IB Diploma Recipient, GPA 4.0/4.0',
    dates: 'September 2021 to May 2025',
    coursework:
      'IB HL Computer Science, IB HL Math AA, IB HL Physics, Mechatronics',
  },
]
