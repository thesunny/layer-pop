import React, { useMemo, useRef } from "react"
import {
  Position,
  useActiveStyle,
  useLayers,
  ZIndex,
  NoTransition,
} from "~/src"

function Tooltip({ dest, title }: { dest: Element; title: string }) {
  const triangleRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  /**
   * We choose to forgot the transition because tooltips change rapidly and
   * adding a transition makes them feel slow.
   */
  const activeTriangleStyle = useActiveStyle(
    Position({
      srcRef: triangleRef,
      dest,
      position: "below",
      align: "center",
      spacing: 0,
    }),
    NoTransition(),
    []
  )
  const triangleStyle = {
    ...activeTriangleStyle,
    borderBottom: "8px solid black",
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
  }
  const activeTipStyle = useActiveStyle(
    Position({
      srcRef: tipRef,
      dest,
      position: "below",
      align: "center",
      spacing: 8,
    }),
    NoTransition(),
    []
  )
  const tipStyle = {
    background: "black",
    color: "white",
    padding: "0 8px",
    borderRadius: 4,
    lineHeight: "2",
    fontSize: "0.875em",
    ...activeTipStyle,
  }
  return (
    <>
      <div ref={triangleRef} style={triangleStyle} />
      <div ref={tipRef} style={tipStyle}>
        {title}
      </div>
    </>
  )
}

export function WithTooltip({
  title,
  children,
}: {
  title: string
  children: React.ReactElement
}) {
  const layers = useLayers()

  /**
   * For performance and code reduction, we generate all the handlers at once.
   */
  const handlers = useMemo(() => {
    /**
     * Open the tooltip on a mouse move and trigger the original handler if it
     * exists.
     *
     * We don't use `onMouseEnter` because it's unreliable.
     */
    function onMouseMove(e: React.SyntheticEvent) {
      layers.open(ZIndex.Tooltip, Tooltip, {
        dest: e.currentTarget,
        title,
      })
      if (children.props.onMouseMove) children.props.onMouseMove(e)
    }
    /**
     * Closes the tooltip and triggers the original handler if it exists.
     */
    function HandleCloseTooltip(
      handlerName: "onMouseDown" | "onMouseUp" | "onMouseLeave"
    ) {
      return function (e: React.SyntheticEvent) {
        layers.close(ZIndex.Tooltip)
        if (children.props[handlerName]) children.props[handlerName](e)
      }
    }
    return {
      onMouseMove,
      onMouseDown: HandleCloseTooltip("onMouseDown"),
      onMouseUp: HandleCloseTooltip("onMouseUp"),
      onMouseLeave: HandleCloseTooltip("onMouseLeave"),
    }
  }, [layers])

  return React.cloneElement(children, handlers)
}
