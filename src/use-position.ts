import { useEffect, useState } from "react"
import throttle from "lodash/throttle"

/**
 * Use this inside the modal to recalculate the position of the modal
 *
 * It can return values in one of two ways:
 *
 * - As a style object
 * - As an object that contains style objects (for example, tooltip needs to style the arrow and the bubble)
 */

export function usePosition<T extends Record<string, any>>(
  fn: () => T,
  dependencies: any[]
): T {
  const [style, setStyle] = useState<T>(fn())
  const reposition = throttle(
    () => {
      try {
        setStyle(fn())
      } catch (e) {
        console.warn(e)
      }
    },
    100,
    { trailing: true }
  )
  useEffect(() => {
    reposition()
    window.addEventListener("resize", reposition)
    window.addEventListener("scroll", reposition)
    return () => {
      window.removeEventListener("resize", reposition)
      window.removeEventListener("scroll", reposition)
    }
  }, dependencies)
  return style
}
