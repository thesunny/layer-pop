# Layer Pop

## Possible Names (must be generic enough)

- overlay
- layer
- modal
- popup

## Description

A flexible popup library for tooltips, modals, and drop-down menus in React.

Layer Pop makes it easy exists because I could not find any other libraries that efficiently and simply handled all these issues that people commonly need when handling popups.

- lightweight
- custom position popups (above, below, right, etc.)
- reposition popups on scroll or screen resize (always keep popup in the right position)
- `escape` to close a popup: It's opt in so you can close popups that are modals or drop down menus, but not tooltips
- modular css transitions: build and reuse custom transition
- multiple levels of popups: support for different levels of popups in the same app. For example, modals, can have menu items which can have tooltips. All three levels can co-exist and have different behavior.
- Restrict one popup per level: As per best practices, you don't want multiple menus to be open at once or multiple tooltips open at once. When you open another popup at the same level, the other popup will be closed.
- Unlimited number of levels: If you have a modal popup which itself needs to have a modal popup, you can create two different levels for modals and they will co-exist. Restricting a popup per level, doesn't restrict you have more than one type of each kind of popup if nesting is required (although usually not recommended)

## Minimal Example

```jsx
function App() {
  const layers = useLayers()

  const alert = useCallback(() => {
    /**
     * Call `layers.open` with the `zIndex` you want to open the popup on,
     * the React Component to open, and the props to pass to the React
     * Component.
     */
    layers.open(1000, Alert, {title: "Title of Alert"})
  })

  return <div>
    <button onClick={alert}>Open Alert</button>
  </div>
}

function Alert({ title }: { title: string} ) {
  return <div style={{
    position: 'absolute',
    left: 100,
    top: 100,
    width: 640,
    border: '1px solid black',
    padding: '1em'
    }}>
    <h1>{title}</h1>
  </div>
}

function AppContainer() {
  return <LayersProvider>
    <App>
  </LayersProvider>
}
```

## Types of Layer Pops

https://ux.stackexchange.com/questions/90336/whats-the-difference-between-a-modal-popup-popover-and-lightbox

- Alert
- Modal/Dialog
- Popup
- Notification
- Lightbox/Theatres
- Popover/Tooltip/Hovercard
- Menu
- UI Components that appear above others like date pickers

# Best Practices Behaviors

https://uxplanet.org/best-practices-for-modals-overlays-dialog-windows-c00c66cddd8c

# `usePosition`

The `usePosition` hook is used inside the layer (modal, alert, popup or tooltip) to position it. It includes several useful presets for positioning above, below or to the left or right.

```tsx
function Alert({
  srcRef,
}: {
  srcRef: React.MutableRefObject<HTMLElement | null>
}) {
  const style = usePosition(() => {
    /**
     * Position below `srcRef`
     */
    return {
      position: "absolute",
      left: srcRef.current.left,
      top: srcRef.current.bottom,
    }
  }, [])

  return <div style={style}></div>
}
```
