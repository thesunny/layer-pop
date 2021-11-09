import { cssStyle } from "."

export function slideDownTransition(initial: boolean) {
  if (initial) {
    return cssStyle({
      opacity: "0",
      transform: "translate(0, -8px)",
    })
  }
  return cssStyle({
    opacity: "1",
    transform: "translate(0, 0)",
    transition: "opacity 200ms, transform 200ms ease-out",
  })
}

export function SlideDownTransition() {
  return slideDownTransition
}
