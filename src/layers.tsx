import React, { useContext, useMemo, useState } from "react"
import { Portal } from "./portal"
import shallowequal from "shallowequal"

export enum ZIndexPresets {
  Toolbar = 1000,
  Dialog = 1010, // Pops up over Toolbar
  SuperDialog = 1020, // Pops up over regular dialog
  Tooltip = 1020, // There can be tooltips in the Dialog so should be above
  Error = 1040, // Errors need to be above everything!
}

type TypedLayer<P extends Record<string, any>> = {
  Component: React.FunctionComponent<P>
  props: P
  zIndex: number
}

type UntypedLayer = TypedLayer<Record<string, any>>

/**
 * All the layers in a Record where the key is the `zIndex` stored as a `string`
 * and the values are each an `UntypedLayer`. We have to make them untyped
 * (i.e. with unknown props) because we don't know ahead of time what the
 * function components and their props will be like.
 *
 * We do know, however, that the `Component` and the `props` will match.
 */
type Layers = {
  [zIndexAsString: string]: UntypedLayer
}

/**
 * The `setLayers` function from using `Layers` with `setState`
 */
type SetLayers = React.Dispatch<React.SetStateAction<Layers>>

/**
 * The `LayersContext` object
 *
 * Responsible for keeping tracking of all the existing layers as well as to
 * allowing setting the value of all existing layers.
 */
const LayersContext = React.createContext<{
  layersData: Layers
  setLayersData: SetLayers
} | null>(null)

/**
 * The `InLayerContext` object
 */
const InLayerContext = React.createContext<UntypedLayer | null>(null)

/**
 * Renders the modal in a portal with the proper context provided to it
 */

function LayerComponent({ layer }: { layer: UntypedLayer }) {
  return (
    <Portal>
      <InLayerContext.Provider value={layer}>
        <layer.Component {...layer.props} />
      </InLayerContext.Provider>
    </Portal>
  )
}

export function LayersProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<Layers>({})
  return (
    <LayersContext.Provider
      value={{ layersData: layers, setLayersData: setLayers }}
    >
      {children}
      {Object.values(layers).map((layer) => (
        <LayerComponent key={layer.zIndex} layer={layer} />
      ))}
    </LayersContext.Provider>
  )
}

/**
 * `useLayers`
 */

export type UseLayers = {
  open: <T>(
    zIndex: number,
    Component: React.FunctionComponent<T>,
    props: T
  ) => void
  close: (zIndex: number) => void
  closeAll: () => void
}

export function useLayers(): UseLayers {
  const layersContext = useContext(LayersContext)
  if (layersContext == null)
    throw new Error(
      `Expected to find a LayersContext.Provider up the component tree but didn't`
    )
  const { layersData: layers, setLayersData: setLayers } = layersContext

  /**
   * Open a layer at a specific zIndex
   */
  function open<T extends Record<string, any>>(
    zIndex: number,
    Component: React.FunctionComponent<T>,
    props: T
  ) {
    /**
     * We type cast to include undefined because it's possible that the layer
     * at a specific `zIndex` doesn't yet exist.
     */
    const prevLayer: UntypedLayer | undefined = layers[zIndex]
    /**
     * Only set the modal if it has changed to prevent re-rendering
     */
    if (
      prevLayer != null &&
      prevLayer.Component === Component &&
      shallowequal(prevLayer.props, props)
    ) {
      return
    }
    /**
     * Set Modal
     */
    setLayers((layers: Layers) => {
      // @ts-ignore
      const layer: UntypedLayer = { Component, props, zIndex }
      const nextLayers = { ...layers, [zIndex]: layer }
      return nextLayers
    })
  }

  /**
   * Close the layer at the specified `zIndex`
   */
  function close(zIndex: number) {
    setLayers((layers: Layers) => {
      const nextLayers = { ...layers }
      delete nextLayers[zIndex]
      return nextLayers
    })
  }

  /**
   * Close all layers regardless of `zIndex`
   */
  function closeAll() {
    setLayers({})
  }

  return { open, close, closeAll }
}

export type Layer = {
  open: <T>(Component: React.FunctionComponent<T>, props: T) => void
  close: () => void
  closeIfCurrent: (e: React.BaseSyntheticEvent) => void
}

export function useInLayer() {
  const layers = useLayers()
  const inLayerContext = useContext(InLayerContext)
  if (inLayerContext == null) {
    throw new Error(
      `useInLayer can only be called in a Component that was opened using 'layers.open'.`
    )
  }
  const layer: Layer = useMemo(
    () => ({
      open<T>(Component: React.FunctionComponent<T>, props: T) {
        layers.open(inLayerContext.zIndex, Component, props)
      },
      close() {
        layers.close(inLayerContext.zIndex)
      },
      closeIfCurrent(e: React.BaseSyntheticEvent) {
        if (e.target === e.currentTarget) {
          layers.close(inLayerContext.zIndex)
        }
      },
    }),
    [inLayerContext.zIndex]
  )
  return layer
}
