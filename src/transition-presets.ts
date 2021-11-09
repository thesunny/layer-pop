import { cssStyle } from "."

export type Direction = "down" | "up" | "left" | "right"

function slideInTransition(initial: boolean, direction: Direction) {
  if (initial) {
    switch (direction) {
      case "up":
        return cssStyle({
          opacity: "0",
          transform: "translate(0, 8px)",
        })
      case "down":
        return cssStyle({
          opacity: "0",
          transform: "translate(0, -8px)",
        })
      case "left":
        return cssStyle({
          opacity: "0",
          transform: "translate(8px, 0)",
        })
      case "right":
        return cssStyle({
          opacity: "0",
          transform: "translate(-8px, 0)",
        })
    }
  }
  return cssStyle({
    opacity: "1",
    transform: "translate(0, 0)",
    transition: "opacity 200ms, transform 200ms ease-out",
  })
}

export function SlideInTransition({ direction }: { direction: Direction }) {
  return function (initial: boolean) {
    return slideInTransition(initial, direction)
  }
}
