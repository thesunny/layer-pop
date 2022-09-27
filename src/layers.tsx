import React, { useContext, useMemo, useState } from "react"
import { Portal } from "./portal"
import shallowequal from "shallowequal"

/**
 * These are named `zIndex` presets values created for convenience. Do not feel
 * obligated to use these values.
 *
 * It's just a good starting point if you haven't used the library before.
 *
 * The `zIndex` values start at `10000` (very high) to try and make it over any
 * other positioned elements.
 */

export enum ZIndex {
  Toolbar = 10000, // floating toolbars
  Dialog = 10010, // Dialog boxes (can pop over toolbars)
  SubDialog = 10020, // Sub Dialog boxes that can be opened over a Dialog
  UI = 10030, // Menu, Data Pickers and other UI components
  Tooltip = 10020, // Tooltips, which can usually appear over almost everything
  Error = 10040, // Errors boxes that need to show above everything!
}

/**
 * Typed Layer Data for a single layer.
 *
 * When we add the Layer data, we want to make sure that the `props` match the
 * `Commponent`'s props.
 */
type TypedLayerData<P extends Record<string, unknown>> = {
  Component: React.FunctionComponent<P>
  props: P
  zIndex: number
}

/**
 * Once the data is inside the `LayersData`, the strong typing from
 * `TypedLayerData` can't be preserved; however, we type the `props` as `any`
 * because we already know they are compatible and so we don't want to deal
 * with the typing errors.
 *
 * This is safe so long as we don't do obviously unsmart things like using
 * the props from one layer with the Component of another.
 */
type UntypedLayerData = TypedLayerData<Record<string, unknown>>

/**
 * All the layers data.
 *
 * All the layers in a Record where the key is the `zIndex` stored as a `string`
 * and the values are each an `UntypedLayer`. We have to make them untyped
 * (i.e. with unknown props) because we don't know ahead of time what the
 * function components and their props will be like.
 *
 * We do know, however, that the `Component` and the `props` will match.
 */
type LayersData = {
  [zIndexAsString: string]: UntypedLayerData
}

/**
 * The `setLayers` function when using `setState` with `Layers`
 */
type SetLayers = React.Dispatch<React.SetStateAction<LayersData>>

/**
 * The `LayersContext` object
 *
 * Responsible for keeping tracking of all the layers data as well as to
 * allowing setting the value of all existing layers.
 */
const LayersContext = React.createContext<{
  layersData: LayersData
  setLayersData: SetLayers
} | null>(null)

/**
 * The `InLayerContext` object
 *
 * Responsible for the `LayerData` object inside a component that has been
 * opened as a Layer.
 *
 * We specifically name it `InLayerContext` instead of `LayerContext` to
 * help remove some of the visual ambiguity due to their similarity.
 */
const InLayerContext = React.createContext<UntypedLayerData | null>(null)

/**
 * Render the modal in a portal as a child of `document.body` with the proper
 * context provided to it
 */
function LayerComponent({ layer }: { layer: UntypedLayerData }) {
  return (
    <Portal>
      <InLayerContext.Provider value={layer}>
        <layer.Component {...layer.props} />
      </InLayerContext.Provider>
    </Portal>
  )
}

/**
 * Adds the `LayersData` context to all the children. Includes access to
 * `setLayers` so that we can modify the `layers` object from the children
 * components.
 */
export function LayersProvider({ children }: { children: React.ReactNode }) {
  const [layers, setLayers] = useState<LayersData>({})
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
 * Type for `Layers` object
 */

export type Layers = {
  open: <T>(
    zIndex: number,
    Component: React.FunctionComponent<T>,
    props: T
  ) => void
  close: (zIndex: number) => void
  closeAll: () => void
}

/**
 * `useLayers`
 *
 * Return a `layers` object that gives us the `layers.open`, `layers.close`
 * and `layers.closeAll` methods.
 */
export function useLayers(): Layers {
  const layersContext = useContext(LayersContext)
  if (layersContext == null)
    throw new Error(
      `Expected to find a LayersContext.Provider up the component tree but didn't`
    )
  const { layersData: layers, setLayersData: setLayers } = layersContext

  /**
   * Open a layer at a specific zIndex
   */
  function open<T extends Record<string, unknown>>(
    zIndex: number,
    Component: React.FunctionComponent<T>,
    props: T
  ) {
    /**
     * We type cast to include undefined because it's possible that the layer
     * at a specific `zIndex` doesn't yet exist.
     */
    const prevLayer: UntypedLayerData | undefined = layers[zIndex]

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
    setLayers((layers: LayersData) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const layer: UntypedLayerData = { Component, props, zIndex }
      const nextLayers = { ...layers, [zIndex]: layer }
      return nextLayers
    })
  }

  /**
   * Close the layer at the specified `zIndex`
   */
  function close(zIndex: number) {
    setLayers((layers: LayersData) => {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { open, close, closeAll }
}

/**
 * Type for `Layer` object
 */

export type InLayer = {
  open: <T>(Component: React.FunctionComponent<T>, props: T) => void
  close: () => void
  closeIfCurrent: (e: React.BaseSyntheticEvent) => void
}

export function useInLayer() {
  const layers = useLayers()
  const inLayerContext = useContext(InLayerContext)
  /**
   * If a Component is designed for use in a layer, the `useInLayer` method
   * will likely be called. When a layer is opened without using `layers.open`
   * we don't get an `InLayerContext` and we throw an error to prevent the
   * Component from being use incorrectly.
   */
  if (inLayerContext == null) {
    throw new Error(
      `useInLayer can only be called in a Component that was opened using 'layers.open'.`
    )
  }

  /**
   * We only need to recreate the `InLayer` object if the `zIndex` has
   * changed. `useMemo` prevents us from recreating the same object multiple
   * times.
   */
  const layer: InLayer = useMemo(
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
