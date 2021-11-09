import React, { FunctionComponent, useCallback, useRef } from "react"
import { Alert } from "~/components/alert"
import {
  LayersProvider,
  Position,
  SlideDownTransition,
  useLayers,
  useLayerEscape,
  useInLayer,
  useActiveStyle,
  useTransition,
  usePosition,
  HorizontalAlign,
  VerticalPosition,
  Where,
} from "~/src"
import { Bootstrap } from "~/components/bootstrap"

/**
 * Add `LayersProvider` above the components where you want the layers.
 *
 * Usually you will add this once for your entire app, like in the `_app.tsx`
 * file in Next.js.
 */
export default function () {
  return (
    <LayersProvider>
      <Bootstrap />
      <App />
    </LayersProvider>
  )
}

function App() {
  /**
   * The `useLayers` hook returns a `layers` object which can be used to
   * `open` a layer at a specific `zIndex`, `close` a layer at a specific
   * `zIndex` or `closeAll` layers.
   */
  const layers = useLayers()
  return (
    <div className="container">
      <h1>Alert</h1>
      <div className="mb-4">
        {/* open the PositionLayer Component which demos `usePosition` */}
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, PositionLayer, { dest: e.currentTarget })
          }
        >
          Alert with usePosition
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, TransitionLayer, {
              dest: e.currentTarget,
            })
          }
        >
          Alert with useTransition
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "below",
              align: "left",
            } as const)
          }
        >
          Alert with ActiveLayer
        </button>
        <button
          className="btn btn-primary"
          onClick={(e) =>
            layers.open(1000, ActiveLayerWithoutEscape, {
              dest: e.currentTarget,
            })
          }
        >
          Alert without Escape
        </button>
      </div>
      <h4>Position Below</h4>
      <div className="mb-4">
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "below",
              align: "left",
            } as const)
          }
        >
          Align Left
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "below",
              align: "center",
            } as const)
          }
        >
          Align Center
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "below",
              align: "right",
            } as const)
          }
        >
          Align Right
        </button>
      </div>
      <h4>Position Above</h4>
      <div className="mb-4">
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "above",
              align: "left",
            } as const)
          }
        >
          Align Left
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "above",
              align: "center",
            } as const)
          }
        >
          Align Center
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) =>
            layers.open(1000, ActiveLayer, {
              dest: e.currentTarget,
              position: "above",
              align: "right",
            } as const)
          }
        >
          Align Right
        </button>
      </div>
    </div>
  )
}

function PositionLayer({ dest }: { dest: HTMLElement }) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = usePosition(
    Position({ srcRef, dest, position: "below", align: "left" }),
    []
  )
  return <Alert ref={srcRef} layer={layer} style={style} message="Positioned" />
}

function TransitionLayer({ dest }: { dest: HTMLElement }) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useTransition(SlideDownTransition())
  return <Alert ref={srcRef} layer={layer} style={style} message="Transition" />
}

function ActiveLayer({
  dest,
  ...where
}: {
  dest: HTMLElement
} & Where) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useActiveStyle(
    Position({ srcRef, dest, spacing: 2, ...where }),
    SlideDownTransition(),
    []
  )
  return (
    <Alert ref={srcRef} layer={layer} style={style} message="Active Style" />
  )
}

function ActiveLayerWithoutEscape({ dest }: { dest: HTMLElement }) {
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useActiveStyle(
    Position({ srcRef, dest, spacing: 2, position: "below", align: "left" }),
    SlideDownTransition(),
    []
  )
  return (
    <Alert ref={srcRef} layer={layer} style={style} message="Active Style" />
  )
}
