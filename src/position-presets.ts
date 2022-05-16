/**
 * exhaustiveness type check for switch or if/else statements
 *
 * <https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript>
 */
export function assertUnreachable(x: never): never {
  throw new Error("This should be unreachable code")
}

export function cssStyle<T extends React.CSSProperties>(value: T) {
  return value
}

function positionInViewport<T extends { left: number; top: number }>({
  src,
  left,
  top,
}: {
  src: HTMLElement
  left: number
  top: number
}) {
  const srcRect = src.getBoundingClientRect()
  /**
   * We use `scrollWidth` instead of `innerWidth` because `scrollWidth`
   * accounts for the width that the toolbar takes up.
   */
  const viewportInnerWidth = document.body.scrollWidth
  let nextLeft = left,
    nextTop = top
  if (nextLeft + srcRect.width > viewportInnerWidth) {
    nextLeft = viewportInnerWidth - srcRect.width
  }
  if (nextTop + srcRect.height > innerHeight)
    nextTop = innerHeight - srcRect.height // padding on bottom
  if (nextLeft < 0) nextLeft = 0
  if (nextTop < 0) nextTop = 0

  return {
    left: nextLeft,
    top: nextTop,
  }
}

export type VerticalPosition = "above" | "below"
export type HorizontalPosition = "left" | "right"

export type VerticalAlign = "top" | "middle" | "bottom"
export type HorizontalAlign = "left" | "center" | "right"

function verticalPosition(
  srcRect: DOMRect,
  destRect: DOMRect,
  position: VerticalPosition,
  spacing: number
) {
  switch (position) {
    case "above":
      return destRect.top - srcRect.height - spacing
    case "below":
      return destRect.bottom + spacing
  }
}

function horizontalPosition(
  srcRect: DOMRect,
  destRect: DOMRect,
  position: HorizontalPosition,
  spacing: number
) {
  switch (position) {
    case "left":
      return destRect.left - srcRect.width - spacing
    case "right":
      return destRect.right + spacing
  }
}

function horizontalAlign(
  srcRect: DOMRect,
  destRect: DOMRect,
  align: HorizontalAlign
): number {
  switch (align) {
    case "left":
      return destRect.left
    case "center":
      const center = destRect.left + destRect.width / 2
      return center - srcRect.width / 2
    case "right":
      return destRect.left + destRect.width - srcRect.width
  }
}

function verticalAlign(
  srcRect: DOMRect,
  destRect: DOMRect,
  align: VerticalAlign
): number {
  switch (align) {
    case "top":
      return destRect.top
    case "middle":
      const middle = destRect.top + destRect.height / 2
      return middle - srcRect.height / 2
    case "bottom":
      return destRect.top + destRect.height - srcRect.height
  }
}

export type Where =
  | { position: VerticalPosition; align: HorizontalAlign }
  | {
      position: HorizontalPosition
      align: VerticalAlign
    }

function calculateWhere(
  srcRect: DOMRect,
  destRect: DOMRect,
  where: Where,
  spacing: number
) {
  if (where.position === "above" || where.position === "below") {
    const y = verticalPosition(srcRect, destRect, where.position, spacing)
    const x = horizontalAlign(srcRect, destRect, where.align)
    return { x, y }
  } else if (where.position === "left" || where.position === "right") {
    return {
      x: horizontalPosition(srcRect, destRect, where.position, spacing),
      y: verticalAlign(srcRect, destRect, where.align),
    }
  }
  assertUnreachable(where.position)
}

/**
 * Position below but we allow `src` to be undefined because it is usually
 * passed in as a ref which can be `undefined`.
 */
export function position({
  srcRef,
  dest,
  spacing = 0,
  ...where
}: {
  srcRef: React.MutableRefObject<HTMLElement | null>
  dest: Element
  spacing?: number
} & Where) {
  const style = cssStyle({
    position: "absolute", // fix the bootstrap position
    margin: 0, // fix the bootstrap margin
    left: -1000, // offscreen to start
    top: 0,
  })

  if (srcRef == null) {
    throw new Error(
      `srcRef is undefined but expected it to contain a ref object`
    )
  }
  if (srcRef.current == null) {
    setTimeout(() => {
      if (srcRef.current == null) {
        throw new Error(
          [
            `srcRef.current is null after 50ms.`,
            `Expected srcRef.current to initially not be set but should bet set after the DOM renders.`,
            `Most like you forgot to assign the ref to an Element.`,
          ].join("\n")
        )
      }
    }, 50)
    return style
  }

  const srcRect = srcRef.current.getBoundingClientRect()
  const destRect = dest.getBoundingClientRect()

  const { x, y } = calculateWhere(srcRect, destRect, where, spacing)

  const { left, top } = positionInViewport({
    src: srcRef.current,
    left: x,
    top: y,
  })
  return { ...style, left, top }
}

export function Position(props: Parameters<typeof position>[0]) {
  return position.bind(position, props)
}
