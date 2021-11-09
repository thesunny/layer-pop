import { useEffect, useLayoutEffect, useState } from "react"
export function useTransition<T extends Record<string, any>>(
  fn: (initial: boolean) => T
) {
  const [style, setStyle] = useState<T>(fn(true))
  useEffect(() => {
    /**
     * The 50ms delay is important.
     *
     * This is probably because the initial style never makes it to the DOM
     * before the value gets updated due to a timing issue.
     *
     * 50ms seems to be the magic number for now
     */
    const timeoutId = setTimeout(() => {
      setStyle(fn(false))
    }, 50)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
  return style
}
