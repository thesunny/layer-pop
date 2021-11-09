import ReactDOM from "react-dom"

/**
 * An easy to use Portal to `document.body`.
 *
 * Anything rendered inside `<Portal>` will appear at the bottom of
 * `document.body`.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(children, document.body)
}
