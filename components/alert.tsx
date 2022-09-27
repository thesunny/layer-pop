import { InLayer } from "~/src/layers"
import React from "react"

export const Alert = React.forwardRef(function Alert(
  {
    message,
    layer,
    style,
  }: {
    message: string
    layer: InLayer
    style: React.CSSProperties
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      className="modal"
      style={{ display: "block" }}
      onClick={layer.closeIfCurrent}
    >
      <div ref={ref} className="modal-dialog" style={style}>
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
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
