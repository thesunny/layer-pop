import { cssStyle } from "."

export type Direction = "down" | "up" | "left" | "right"

function slideInTransition(
  initial: boolean,
  direction: Direction,
  duration = 200,
  distance = 8
) {
  if (initial) {
    switch (direction) {
      case "up":
        return cssStyle({
          opacity: "0",
          transform: `translate(0, ${distance}px)`,
        })
      case "down":
        return cssStyle({
          opacity: "0",
          transform: `translate(0, -${distance}px)`,
        })
      case "left":
        return cssStyle({
          opacity: "0",
          transform: `translate(${distance}px, 0)`,
        })
      case "right":
        return cssStyle({
          opacity: "0",
          transform: `translate(-${distance}px, 0)`,
        })
    }
  }
  return cssStyle({
    opacity: "1",
    transform: "translate(0, 0)",
    transition: `opacity ${duration}ms, transform ${duration}ms ease-out`,
  })
}

export function SlideInTransition({
  direction,
  duration = 200,
  distance = 8,
}: {
  direction: Direction
  duration?: number
  distance?: number
}) {
  return function (initial: boolean) {
    return slideInTransition(initial, direction, duration, distance)
  }
}

export function NoTransition() {
  return function () {
    return {}
  }
}
