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
  console.log({ position, spacing })
  switch (position) {
    case "above":
      return destRect.top - srcRect.height - spacing
    case "below":
      return destRect.bottom + spacing
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
  console.log({ where, spacing })
  if (where.position === "above" || where.position === "below") {
    const y = verticalPosition(srcRect, destRect, where.position, spacing)
    const x = horizontalAlign(srcRect, destRect, where.align)
    return { x, y }
  } else {
    return { x: 0, y: 0 }
  }
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
}: // position = "below",
// align = "left",
{
  srcRef: React.MutableRefObject<HTMLElement | null>
  dest: HTMLElement
  spacing?: number
} & Where) {
  const style = cssStyle({
    position: "absolute", // fix the bootstrap position
    margin: 0, // fix the bootstrap margin
    left: -1000, // offscreen to start
    top: 0,
  })

  if (srcRef.current === null) return style

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
