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

/**
 * Position below but we allow `src` to be undefined because it is usually
 * passed in as a ref which can be `undefined`.
 */
export function positionBelow({
  srcRef,
  dest,
  spacing = 0,
}: {
  srcRef: React.MutableRefObject<HTMLElement | null>
  dest: HTMLElement
  spacing?: number
}) {
  const style = cssStyle({
    position: "absolute", // override the bootstrap position
    margin: 0, // kill the bootstrap margin
    left: -1000, // offscreen to start
    top: 0,
  })

  if (srcRef.current === null) return style

  const destRect = dest.getBoundingClientRect()
  const { left, top } = positionInViewport({
    src: srcRef.current,
    left: destRect.left,
    top: destRect.bottom + spacing,
  })
  return { ...style, left, top }
}

export function PositionBelow(props: {
  srcRef: React.MutableRefObject<HTMLElement | null>
  dest: HTMLElement
  spacing?: number
}) {
  return positionBelow.bind(positionBelow, props)
}
