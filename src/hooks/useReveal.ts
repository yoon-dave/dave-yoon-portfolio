import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return {
    ref,
    visible,
    className: `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
      visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`,
    style: { transitionDelay: visible ? `${delay}ms` : '0ms' },
  }
}
