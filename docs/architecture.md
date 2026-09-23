# Structure review

The feature-based proposal is sound: screens belong with their feature, reused UI belongs in components, data belongs outside page markup, and global tokens should control both role themes.

The delivered split makes the following explicit adjustments to keep this prototype visually identical:

- `screenRegistry.jsx` maps all 47 source templates to real JSX components; `config/routes.js` maps the prototype's route keys to those screen names.
- `main.jsx` mounts `App.jsx`, then initializes the controllers after their hosts exist.
- `mountScreen.jsx` mounts a route's JSX in `ScreenLayout.jsx`. `render.js` applies the original data fills, form setup, and transitions.
- `context/runtime.js` contains mutable demo state and controller references. `context/session.js` creates/reset state and derives role information. This is not an authentication service or React Context provider.
- Interactions live in feature controller files; the central action dispatcher and existing label bindings are in `app/actions.js` and `app/actionBindings.js`.
- CSS is split by its existing ordered layers. Reorganizing every selector into CSS Modules could alter cascade precedence, so it is intentionally deferred.
- Desktop/mobile variants remain in each screen component. Consolidating these into a single responsive DOM is a later refactor with its own parity checks.
- Unimplemented API modules, empty UI components, and unused provider files were not created.

## Rendering ownership

React renders the base screen markup; the extracted controllers then own the enhanced DOM for that route. React does not reconcile those subtrees between controller updates. Route transitions create a new root and unmount the old one. Overlays and cards currently use the original DOM/HTML renderers; copied sheet markup comes from the same JSX components through `renderToStaticMarkup`.

When converting a controller to React hooks, migrate the entire ownership boundary (for example, SwipeDeck plus its children) together. Avoid React and imperative code updating the same nodes.

## Dependency direction

Feature controllers consume state, configuration, mock records, and UI utilities. Some routing/overlay/controller modules reference each other; only function calls access shared state after bootstrap. Keep module initialization free of calls into UI state. Browser-independent filtering is in `utils/discoveryFilters.js`.

## Fonts and artwork

Six embedded fonts were extracted byte-for-byte to `public/fonts/`; the original font-face rules still select them. Existing SVG icons and placeholder artwork were preserved. The supplied source contained no separate font license documents; confirm distribution rights before public release.
