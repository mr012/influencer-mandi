# Backend handoff — no endpoints agreed

This package is a frontend demo. It makes no authentication, payment, upload, moderation, or chat network requests. Proposed endpoint names must be agreed with the backend team before implementation.

| Domain | Current source | Required production work |
|---|---|---|
| Authentication | `context/session.js`, `app/actions.js` | Sessions, signup/login, verification, resend, password reset, server-side authorization |
| Profiles | `features/profile/`, `mocks/creators.js` | Current account records, validated updates, preview from actual saved profile |
| Discovery | `features/discovery/`, `utils/discoveryFilters.js` | Pagination, stable IDs, category/location catalogs, eligible results |
| Interests/matches | `features/discovery/deckController.js` | Idempotent interest actions, pass behavior, authoritative matching |
| Campaigns | `features/campaigns/` | CRUD, drafts, status, ownership, interested-creator relationships |
| Messaging | `features/chats/chatController.js` | Conversation IDs, history, unread state, send acknowledgments, realtime delivery |
| Billing | `features/billing/` | Approved pricing, checkout, subscription state, receipts/refunds |
| Media | Existing placeholder slots | Upload authorization, storage URLs, processing, playback |
| Support/admin | `features/support/`, `features/admin/` | Ticket submission, review queues, auditable moderation actions |

Define request/response schemas, errors, loading/empty/error UX, pagination, and permissions before connecting these modules. Never put private keys in browser environment variables.

Current records use demo IDs such as `c1` and `u1`. The existing profile preview intentionally uses the original demo IDs for fidelity. Replace these with authenticated user/campaign records when integrating.

Form drafts use keys scoped by role, route, label, and field index. They are not saved backend records. Map fields to explicit record properties before implementing real saves. The current seeded replies and odd/even like matching rule must not be described as production behavior.
