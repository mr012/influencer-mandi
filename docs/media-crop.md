# Media crop

Photo uploads in creator onboarding/profile editing, brand onboarding/profile editing, and campaign creation/editing use the supplied media-crop reference. The editor's HTML, CSS and controller are separate files in `src/components/ui`; Shadow DOM isolates the reference styles from the application's existing `.side`, `.stage`, and `.btn` styles. A native modal dialog handles background interaction. The pure geometry lives in `cropGeometry.js`.

Creator/campaign photos export 1080 × 1350 JPEGs; logos export 600 × 600 JPEGs. Exported `file`/`url` already contain the crop, rotation and Fit background. The legacy `crop` field is neutral to prevent existing renderers from applying the crop twice. `cropData` holds the reference's source-pixel rectangle, rotation, Fit/background settings, output size and cover order. Fit rectangles may extend outside the source: a backend must composite the specified background rather than directly applying an out-of-bounds crop.

Original File objects and editorState are retained for photo re-editing during the session. Multiple photo uploads reopen existing photos with their previous crops; Make cover reorders the entire photo collection. Campaign drafts retain published image URLs until save. Details use full exported photos while discovery cards continue to center-crop the cover into their existing layout.

The current app stores uploads in memory. Durable originals, exported files and metadata require backend storage, as before. Video uploads retain the previous video crop controls and percentage metadata; this change does not transcode videos. The reference itself only implements photo exports.

Validation: `npm run build`, `npm test` (including crop-boundary tests over source shapes, both aspect ratios, rotations and extreme zoom/pan; Fit margins; rotated square crops). Browser visual QA could not run in this environment because the browser blocks the local development URL. Review desktop/mobile appearance and touch gestures before merging.
