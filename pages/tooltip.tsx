import React, { useRef } from "react"
import {
  LayersProvider,
  Position,
  SlideInTransition,
  useLayers,
  useLayerEscape,
  useInLayer,
  useActiveStyle,
  useTransition,
  usePosition,
  Where,
  Layers,
  Direction,
} from "~/src"
import { Bootstrap } from "~/components/bootstrap"
// import { ModalType, useModal } from "~/lib/modal"
// import { Callout } from "./callout"
import { WithTooltip } from "~/lib/tooltip"

// function Tooltip({
//   children,
//   hotkey,
//   label,
// }: {
//   children: React.ReactElement
//   hotkey?: string
//   label: React.ReactNode
// }) {
//   const modal = useModal(ModalType.Tooltip)
//   function openTooltip(e: { currentTarget: HTMLElement }) {
//     modal.open(Callout, { dest: e.currentTarget, hotkey, label })
//   }
//   function closeTooltip() {
//     modal.close()
//   }
//   return React.cloneElement(children, {
//     onMouseDown: (e: any) => {
//       closeTooltip()
//       children.props.onMouseDown(e)
//     },
//     onMouseMove: openTooltip,
//     onMouseLeave: closeTooltip,
//     onMouseUp: closeTooltip,
//   })
// }

// export { Tooltip }

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
      <h1>Tooltips</h1>
      <div className="mb-4">
        <WithTooltip title="Heading 1">
          <button className="btn btn-primary me-1">H1</button>
        </WithTooltip>
        <WithTooltip title="Heading 2">
          <button className="btn btn-primary me-1">H2</button>
        </WithTooltip>
        <WithTooltip title="Heading 3">
          <button className="btn btn-primary me-1">H3</button>
        </WithTooltip>
        <WithTooltip title="Paragraph">
          <button className="btn btn-primary me-1">P</button>
        </WithTooltip>
        <WithTooltip title="Bold">
          <button className="btn btn-primary me-1">B</button>
        </WithTooltip>
        <WithTooltip title="Italic">
          <button className="btn btn-primary me-1">I</button>
        </WithTooltip>
      </div>
      <h4>Check Callbacks are Firing</h4>
      <WithTooltip title="Heading 1">
        <button
          className="btn btn-primary me-1"
          onMouseDown={() => console.log("onMouseDown")}
          onMouseMove={() => console.log("onMouseMove")}
          onMouseLeave={() => console.log("onMouseLeave")}
          onMouseUp={() => console.log("onMouseUp")}
        >
          H1
        </button>
      </WithTooltip>
    </div>
  )
}
