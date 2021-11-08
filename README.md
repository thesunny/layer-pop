# Layer Pop

## Possible Names (must be generic enough)

- overlay
- layer
- modal
- popup

## Description

A simple flexible multi-layer popup library for tooltips, modals, and drop-down menus in React

Layer Pop makes it easy exists because I could not find any other libraries that efficiently and simply handled all these issues that people commonly need when handling popups.

- lightweight
- reposition modals when the screen is resized or scrolled
- automatically closing siblings popups like hovering over a toolbar, you only want one tooltip to show at a time
- handling multiple layers of popups that can co-exist like a modal and a tooltip (but still ensuring no two modals can exist and no two tooltips can exist)
- easily add custom key handlers like hitting `esc` to close a popup
- handling closable popups like modals, and auto-closing ones like tooltips

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

# Libraries

Layer Pop consists of three features, each of which can be used on its own making them simple to understand, but together make for a powerful and flexible library.

- `layers`: Allows you to open and close components on different layers. For example, you may have a layer for modal dialogs with a layer on top of that for menu components and a layer on top of that for tooltips. Your tooltips, menu and modals can all exist at the same time (think of opening a modal, with a menu open, and a flyout tooltip on hover); however, layers takes care of only allowing one to exist at a time (e.g. you will never want two tooltips, or two open menus, or two modals at the same time).
- `positioning`: All
