# Operio Client Portal

Run from the monorepo root:

```sh
npm run dev:client
npm run build:client
npm run lint:client
npm run test --workspace=@operio/client
```

Set `VITE_API_URL` in `apps/client/.env.local` to your backend origin. When omitted, requests use the current origin. The backend must support credentialed requests from the Client origin and enforce client account permissions.

Client login sends `emailAddress` and `password` to `POST /api/v1/login` using session cookies. `GET /api/v1/session` returns the client and automatically refreshes expired access; a session 401 is treated as signed out. Other protected requests use `POST /api/v1/refresh-token` to rotate client cookies and retry after a 401. Logout uses `POST /api/v1/auth/logout`. Session data is extracted from `response.data.data`. No live account was used during development.

The app uses feature-owned API functions, React Query hooks and cache keys, Joi validation, React Hook Form, and shared `@operio/api` transport and `@operio/ui` components. Authentication expires to the login route, preserves internal deep links, and clears account-specific query data at session boundaries. Server/network failures offer a retry instead of being treated as an invalid key.

## Routes

| Page | Route |
| --- | --- |
| Dashboard | /dashboard |
| My Company | /my-company |
| My Applications | /my-applications |
| My Documents | /my-documents |
| Renewals | /renewals |
| Requests & Support | /requests-support |
| Notifications | /notifications |
| Profile | /profile |

The root redirects to Dashboard. All workspace routes, including the not-found screen, require a session. Login is public. Deployments must rewrite SPA routes to `index.html`.

The dashboard provides navigation shortcuts and Profile displays available session information. The other six pages are intentional feature shells awaiting their Client API contracts and business workflows. No fabricated records or unread counts are displayed. `NavMain` supports positive unread counts when real data is connected.

The shell includes an active-state sidebar, desktop collapse, a mobile drawer that closes on navigation, account menu/logout, page search, notifications shortcut, persistent light/dark preference, skip link, route titles, loading states, and a not-found page. Client uses its own Vite alias and Tailwind plugin. No Admin application code is imported.

## Verification

Seven automated auth tests cover payload/transport, session restoration, unauthorized vs server failures, concurrent refresh, logout failure handling, safe return paths, validation, and observer-safe cache cleanup. Browser checks used an isolated temporary local fixture backend for login/deep-link return, navigation, profile, theme switching, mobile drawer, and logout. Real backend integration remains to be verified. Client lint and both production builds pass; large-bundle warnings remain.
