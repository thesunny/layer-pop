import React, { FunctionComponent, useCallback, useRef } from "react"
import { Alert } from "~/components/alert"
import {
  LayersProvider,
  PositionBelow,
  SlideDownTransition,
  useLayers,
  useLayerEscape,
  useInLayer,
  useActiveStyle,
  useTransition,
  usePosition,
} from "~/.dist/src"
import { Bootstrap } from "~/components/bootstrap"

export default function () {
  return (
    <LayersProvider>
      <Bootstrap />
      <App />
    </LayersProvider>
  )
}

function App() {
  const layers = useLayers()
  const alert = useCallback(
    (e: React.MouseEvent<HTMLElement>, Component: FunctionComponent<any>) => {
      layers.open(1000, Component, { dest: e.currentTarget })
    },
    []
  )
  return (
    <div className="container">
      <h1>Alert</h1>
      <div className="mb-4">
        <button
          className="btn btn-primary me-1"
          onClick={(e) => alert(e, PositionLayer)}
        >
          Positioned Alert
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) => alert(e, TransitionLayer)}
        >
          Transition Alert
        </button>
        <button
          className="btn btn-primary me-1"
          onClick={(e) => alert(e, ActiveLayer)}
        >
          Active Style Alert
        </button>
      </div>
    </div>
  )
}

function PositionLayer({ dest }: { dest: HTMLElement }) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = usePosition(PositionBelow({ srcRef, dest }), [])
  return <Alert ref={srcRef} layer={layer} style={style} message="Positioned" />
}

function TransitionLayer({ dest }: { dest: HTMLElement }) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useTransition(SlideDownTransition())
  return <Alert ref={srcRef} layer={layer} style={style} message="Transition" />
}

function ActiveLayer({ dest }: { dest: HTMLElement }) {
  useLayerEscape()
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useActiveStyle(
    PositionBelow({ srcRef, dest, spacing: 2 }),
    SlideDownTransition(),
    []
  )
  return (
    <Alert ref={srcRef} layer={layer} style={style} message="Active Style" />
  )
}
