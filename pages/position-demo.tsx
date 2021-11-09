import { LayersProvider, useLayers, useInLayer } from "~/src/layers"
import React, { useCallback, useRef } from "react"
import { Alert } from "~/components/alert"
import { cssStyle, usePosition } from "~/src"

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
    layers.open(1000, AlertLayer, { message: "Popup!", dest: e.currentTarget })
  }, [])
  return (
    <div className="container">
      <h1>Alert</h1>
      <button className="btn btn-primary me-1" onClick={alert}>
        Alert
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

function AlertLayer({ message, dest }: { message: string; dest: HTMLElement }) {
  const srcRef = useRef<HTMLDivElement>(null)
  const layer = useInLayer()
  const positionStyle = usePosition(() => {
    const style = cssStyle({
      position: "absolute", // override the bootstrap position
      margin: 0, // kill the bootstrap margin
      left: -1000, // offscreen to start
      top: 0,
    })
    if (srcRef.current === null) return style
    const destRect = dest.getBoundingClientRect()
    return cssStyle({
      position: "absolute", // override the bootstrap position
      margin: 0, // kill the bootstrap margin
      left: destRect.left,
      top: destRect.bottom + 3,
    })
  }, [])

  return (
    <Alert ref={srcRef} layer={layer} style={positionStyle} message={message} />
  )
}
