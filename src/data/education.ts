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
      'Software Design & Implementation, Hardware/Software Interface, Foundations of Computing, Data Structures & Parallelism, Systems Programming, Computer Security, Matrix Algebra, Essentials of Management and Entrepreneurship',
  },
  {
    school: 'Skyline High School',
    location: 'Sammamish, WA',
    detail: 'IB Diploma Recipient — GPA 4.0/4.0',
    dates: 'September 2021 to May 2025',
    coursework: 'IB HL Computer Science, IB HL Math AA, IB HL Physics, Mechatronics',
  },
]
