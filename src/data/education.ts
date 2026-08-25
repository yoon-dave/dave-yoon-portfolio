export interface EducationEntry {
  school: string
  location: string
  program?: string
  detail: string
  dates: string
  coursework: string
}

export const education: EducationEntry[] = [
  {
    school: 'University of Washington',
    location: 'Seattle, WA',
    program: 'Allen School of Computer Science & Foster School of Business',
    detail: 'B.S. Computer Science, Minor in Business Administration — GPA 3.98/4.00',
    dates: 'September 2025 to June 2028',
    coursework:
      'Linear Algebra, Foundations of Computing (CSE 311), Software Design & Implementation (CSE 331), Hardware/Software Interface (CSE 351)',
  },
  {
    school: 'Skyline High School',
    location: 'Sammamish, WA',
    detail: 'IB Diploma Recipient — GPA 4.0/4.0',
    dates: 'September 2021 to May 2025',
    coursework: 'IB HL Computer Science, IB HL Math AA, IB HL Physics, Mechatronics',
  },
]
