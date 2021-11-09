import { useEffect } from "react"
import { useInLayer, Layer } from "."

export function useLayerEscape() {
  const layer = useInLayer()
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        layer.close()
      }
    }
    document.body.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.removeEventListener("keydown", onKeyDown)
    }
  }, [])
}
