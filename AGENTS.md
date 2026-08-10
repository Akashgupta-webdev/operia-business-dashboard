# Insurance CRM Client - Agent Guidelines

## Project context

- This is an admin-facing insurance CRM dashboard built with Vite, React, Tailwind CSS, and shadcn/ui.
- Preserve the existing architecture, UI conventions, and user workflows unless the task explicitly requires a change.
- Use `docs/design.md` as the source of truth for the visual styling of all pages and components, including colors, typography, spacing, layout, elevation, shapes, responsive behavior, and component states.

## Implementation rules

- Inspect the relevant code before editing. Reuse existing components, hooks, utilities, and patterns whenever practical.
- Prefer shadcn/ui components before building custom UI primitives.
- When creating or changing page or component UI, review `docs/design.md` first and implement its design tokens and guidance. Reuse existing theme variables and shared styles where available instead of scattering hard-coded values.
- If an existing component nearly fits, make the smallest sensible change to make it reusable instead of duplicating it. Keep its existing callers working.
- Keep components focused and split substantial UI, logic, hooks, services, and utilities into appropriate files. Do not place an entire feature in one file.
- Follow SOLID principles pragmatically: give modules one clear responsibility, depend on abstractions where useful, and extend behavior without unnecessary rewrites.
- Use the established folders for their intended concerns: `components` for reusable UI, `pages` for route-level screens, `hooks` for React hooks, `service` for API/domain services, `config` for configuration, `routes` for routing, `lib` for shared utilities, and `assets` for static assets.
- Keep code simple, readable, and consistent with the surrounding code. Avoid premature abstractions and unrelated refactors.
- Use clear names. Add short comments or JSDoc only when a function, service, business rule, or non-obvious decision needs explanation; do not comment self-explanatory code.
- Preserve the project's current JavaScript/TypeScript conventions and import style. Do not add dependencies unless they provide clear value and existing packages cannot solve the problem.
- Build responsive and accessible UI: use semantic HTML, labels, keyboard support, visible focus states, and shadcn accessibility behavior.
- Treat customer and insurance data as sensitive. Do not expose secrets or personal data in source code, URLs, logs, fixtures, or client-visible error messages.
- Handle loading, empty, error, and success states where relevant. Keep API access in services/hooks rather than embedding it throughout presentation components.
- When providing or implementing API-related details, keep each concern in its designated location: place validation rules in `src/validator` and constant values in `src/constants/`, using a file whose base name matches the relevant page, and define API endpoints and request functions in `src/service/client.service.js`.
- Use TanStack Query's `useQuery` to fetch data through the API request functions defined in `src/service/client.service.js`.
- Use TanStack Query's `useMutation` to create, update, or delete data through the API request functions defined in `src/service/client.service.js`.
- Use Joi for validation.
- Use React Hook Form to build and manage forms.

## Validation and delivery

- After changes, review the diff and run the most relevant checks. At minimum, run `npm run lint` and `npm run build` when feasible.
- Test the affected behavior and important edge cases. Do not leave known lint, build, runtime, or console errors caused by the change.
- Keep changes scoped to the request and preserve unrelated user work. Report what changed, which checks ran, and any remaining limitations.
