import { LayersProvider, useLayers, useInLayer } from "~/src/layers"
import React, { useCallback, useRef } from "react"
import {
  positionBelow,
  SlideBelowEffect,
  slideDownTransition,
  useLayerEffect,
} from "~/src"

// function Alert({ message }: { message: string }) {
//   return <div>ALERT! {message}</div>
// }

export default function () {
  return (
    <LayersProvider>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />
      <App />
    </LayersProvider>
  )
}

function App() {
  const layers = useLayers()
  const alert = useCallback((e: React.MouseEvent<HTMLElement>) => {
    layers.open(1000, Alert, { message: "Popup!", dest: e.currentTarget })
    /**
     * [layers] needed for now because the first render returns the temporary
     * `setLayers` which is a noop. Should find a way to fix this as this is
     * too prone to error.
     */
  }, [])
  const closeAll = useCallback(() => {
    layers.closeAll()
  }, [])
  return (
    <div className="container">
      <h1>Alert</h1>
      <button className="btn btn-primary me-1" onClick={alert}>
        Alert
      </button>
      <button className="btn btn-outline-secondary" onClick={closeAll}>
        Close all
      </button>
      <button
        className="btn btn-primary me-1"
        onClick={alert}
        style={{ position: "absolute", bottom: 10, right: 10 }}
      >
        Alert
      </button>
    </div>
  )
}

function Alert({ message, dest }: { message: string; dest: HTMLElement }) {
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const style = useLayerEffect(
    SlideBelowEffect({
      srcRef,
      dest,
      spacing: 3,
      style: { width: 480 },
    }),
    [dest]
  )

  const changeMessage = useCallback(() => {
    layer.open(Alert, { message: "The second alert has come!", dest })
  }, [layer])
  return (
    <div
      className="modal"
      style={{ display: "block" }}
      onClick={layer.closeIfCurrent}
    >
      <div className="modal-dialog" ref={srcRef} style={style}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{message}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={layer.close}
            ></button>
          </div>
          <div className="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={layer.close}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={changeMessage}
            >
              Change Message
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
