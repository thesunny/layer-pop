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
  Layers,
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
        <ActiveButton layers={layers} position="below" align="left">
          Align Left
        </ActiveButton>
        <ActiveButton layers={layers} position="below" align="center">
          Align Center
        </ActiveButton>
        <ActiveButton layers={layers} position="below" align="right">
          Align Right
        </ActiveButton>
      </div>
      <h4>Position Above</h4>
      <div className="mb-4">
        <ActiveButton layers={layers} position="above" align="left">
          Align Left
        </ActiveButton>
        <ActiveButton layers={layers} position="above" align="center">
          Align Center
        </ActiveButton>
        <ActiveButton layers={layers} position="above" align="right">
          Align Right
        </ActiveButton>
      </div>
      <div style={{ display: "flex" }}>
        <div className="me-5">
          <h4>Position Right</h4>
          <div className="mb-4">
            <div className="mb-1">
              <ActiveButton layers={layers} position="right" align="top">
                Align Top
              </ActiveButton>
            </div>
            <div className="mb-1">
              <ActiveButton layers={layers} position="right" align="middle">
                Align Middle
              </ActiveButton>
            </div>
            <div className="mb-1">
              <ActiveButton layers={layers} position="right" align="bottom">
                Align Bottom
              </ActiveButton>
            </div>
          </div>
        </div>
        <div>
          <h4>Position left</h4>
          <div className="mb-4">
            <div className="mb-1">
              <ActiveButton layers={layers} position="left" align="top">
                Align Top
              </ActiveButton>
            </div>
            <div className="mb-1">
              <ActiveButton layers={layers} position="left" align="middle">
                Align Middle
              </ActiveButton>
            </div>
            <div className="mb-1">
              <ActiveButton layers={layers} position="left" align="bottom">
                Align Bottom
              </ActiveButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActiveButton({
  children,
  layers,
  ...where
}: { children: React.ReactNode; layers: Layers } & Where) {
  return (
    <button
      className="btn btn-primary me-1"
      onClick={(e) =>
        layers.open(1000, ActiveLayer, {
          dest: e.currentTarget,
          ...where,
        } as const)
      }
      style={{ width: 120 }}
    >
      {children}
    </button>
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
    Position({ srcRef, dest, spacing: 8, ...where }),
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
