# Influencer Mandi

A separated React/JSX project based on the supplied `mandi-prototype.html`. The original dark design, orange/green themes, embedded fonts, 47 screen templates, responsive layouts, and demo interactions are preserved.

## Run it

Install Node.js 22.12 or newer (tested with Node 24.19), open a terminal in this folder, then run:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. On Windows, `Start-Mandi.cmd` runs these steps for you. Stop the server with Ctrl+C.

```sh
npm run build
npm run preview
npm test
```

`dist/` contains the tested production build. Serve this folder over HTTP; do not double-click `dist/index.html`. For the untouched, double-clickable demo, open `reference/mandi-prototype.html`.

## Where to edit

| Change | Files |
|---|---|
| Screen text and layout | `src/features/<feature>/*.jsx` |
| Account/detail sheet markup | `src/components/account/` and `src/components/details/` |
| Colors | `src/styles/tokens.css` |
| Fonts | `src/styles/typography.css`, `public/fonts/` |
| Responsive design and existing corrections | `src/styles/` — order in `global.css` matters |
| Navigation and routes | `src/config/navigationItems.js`, `src/config/routes.js`, `src/app/routes.js` |
| Swipe cards and gestures | `src/components/cards/cardMarkup.js`, `src/features/discovery/deckController.js` |
| Filters | `src/features/discovery/filterController.js`, `src/utils/discoveryFilters.js` |
| Chats | `src/features/chats/chatController.js` |
| Forms and tags | `src/components/forms/editableFields.js`, `src/features/profile/tagController.js` |
| Demo records and replies | `src/mocks/` |
| Demo role switcher | `src/dev/` |

See `docs/file-map.md` for every delivered file and `docs/screen-map.md` for the complete source-to-JSX map.

## Architecture: fidelity-preserving split

All 47 source templates are native JSX components, mounted through React. The original interaction code has been separated into feature controllers, reusable DOM utilities, navigation, state, and mock-data modules. There is no iframe around the app and it does not load the original HTML to run.

This deliberately preserves the prototype's imperative DOM controllers alongside React-rendered screen markup. It is **not yet a fully declarative React rewrite**: controllers fill cards/chats, turn placeholder fields into inputs, attach gestures, and manage overlays. Each route gets a new React root and the previous root is unmounted after its exit animation. Do not add React state updates inside controller-owned subtrees without first migrating that subtree's controller.

The earlier proposed directory tree was a target architecture, not a promise to create empty components. This version contains working modules. It retains the source's desktop/mobile JSX variants and ordered global CSS for visual parity. A later controller-to-hooks/CSS-Modules migration can be done feature by feature against the included comparison harness.

## Demo limitations

Authentication, email codes, payments, matches, chat replies, campaign actions, and moderation are simulated. Reloading resets in-memory state. Some Save actions retain form drafts and show a toast but do not update the underlying record. Media slots are the original placeholder artwork. No backend, persistent database, payment provider, or real media upload is connected.

The visible role switcher is a demo convenience, not authorization. Backend endpoints and contracts have not been agreed; see `docs/backend-handoff.md`. Browser/system-back integration and comprehensive accessibility work remain future work, as in the original.

## Verification

`npm test` checks filtering rules. With the dev server running, open `/qa/compare.html` and click **Run full comparison** to compare the original and React version at 320, 393, 768, and 1440px, then exercise key interactions. The original reference is never modified.

See `design-qa.md` for the actual browser verification performed and its limits.
