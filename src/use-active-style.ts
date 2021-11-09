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
  P extends Record<string, any>,
  T extends Record<string, any>
>(
  positionFn: () => P,
  transitionFn: (initial: boolean) => T,
  dependencies: any[]
): P & T {
  const positionStyle = usePosition(positionFn, dependencies)
  const transitionStyle = useTransition(transitionFn)
  return { ...positionStyle, ...transitionStyle }
}
