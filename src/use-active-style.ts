import { usePosition, useTransition } from "."

/**
 * Use this inside the modal to recalculate the position of the modal
 *
 * It can return values in one of two ways:
 *
 * - As a style object
 * - As an object that contains style objects (for example, tooltip needs to style the arrow and the bubble)
 */

export function useActiveStyle<
  P extends Record<string, unknown>,
  T extends Record<string, unknown>
>(
  positionFn: () => P,
  transitionFn: (initial: boolean) => T,
  dependencies: unknown[]
): P & T {
  const positionStyle = usePosition(positionFn, dependencies)
  const transitionStyle = useTransition(transitionFn)
  return { ...positionStyle, ...transitionStyle }
}
