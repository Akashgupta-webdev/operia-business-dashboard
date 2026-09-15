# Operio Monorepo — Agent & Developer Guide

This file defines the working rules, architecture conventions, and repository structure for the Operio Business Dashboard monorepo.

All AI coding agents and human contributors should read this file before creating, moving, refactoring, or deleting code.

The primary goals are:

* keep the monorepo scalable
* preserve existing behavior
* organize code by feature/domain
* keep Admin and Client applications separate
* share only reusable infrastructure and UI
* avoid duplicated ShadCN components
* install dependencies in the correct workspace
* avoid circular dependencies
* keep imports predictable
* avoid unnecessary architectural rewrites

---

# 1. Repository Overview

This repository is a frontend monorepo containing two separate Vite + React applications:

```text
apps/
├── admin/
└── client/
```

Shared reusable code lives under:

```text
packages/
├── ui/
├── api/
└── utils/
```

The repository is managed using npm workspaces.

The root `package.json` manages all applications and shared packages.

The Admin and Client applications are separate applications and may be deployed independently to different domains.

Example production architecture:

```text
admin.operio.com
        │
        ▼
apps/admin

app.operio.com
        │
        ▼
apps/client

Both applications
        │
        ▼
Shared backend API
```

The frontend monorepo does not imply a single deployed application.

---

# 2. Read the Design Documentation First

Before making UI or visual changes, inspect:

```text
docs/design.md
```

This file contains project-specific design guidance and should be treated as the primary design reference.

Agents must check `docs/design.md` before:

* redesigning layouts
* changing spacing conventions
* changing visual hierarchy
* introducing new visual patterns
* changing colors
* changing typography
* modifying component appearance
* creating new major UI sections

Do not invent a new design system when an existing one already exists.

---

# 3. High-Level Repository Structure

Expected structure:

```text
operio/
├── apps/
│   ├── admin/
│   └── client/
│
├── packages/
│   ├── ui/
│   ├── api/
│   └── utils/
│
├── docs/
│   └── design.md
│
├── AGENTS.md
├── package.json
├── package-lock.json
└── README.md
```

Each application has its own:

```text
src/
public/
package.json
vite.config.js
components.json
.env.local
```

Shared packages have their own `package.json` and should declare their own dependencies.

---

# 4. Application Responsibilities

## Admin

Location:

```text
apps/admin/
```

Purpose:

Internal Operio staff/admin dashboard.

Typical responsibilities include:

* clients
* companies
* services
* documents
* renewals
* finance
* reports
* tax and compliance
* visa and employees
* reminders
* settings
* internal management operations

Admin-specific code must not be placed inside the Client application.

---

## Client

Location:

```text
apps/client/
```

Purpose:

Customer-facing Operio dashboard.

Typical responsibilities may include:

* client profile
* client services
* client documents
* client renewals
* invoices
* payments
* support
* notifications
* account settings

Client-specific code must not be placed inside the Admin application.

---

# 5. Feature/Domain-Based Architecture

Application code must be organized by business feature/domain, not only by technical file type.

Avoid creating large global directories such as:

```text
hooks/
services/
validators/
constants/
components/
```

containing unrelated files from many business domains.

Instead, prefer:

```text
src/features/
├── auth/
├── clients/
├── companies/
├── dashboard/
├── finance/
├── renewals/
├── reports/
└── ...
```

Each feature owns its own related code.

Example:

```text
features/clients/
├── api/
├── components/
├── hooks/
├── constants/
├── pages/
├── schemas/
└── utils/
```

Only create subfolders that are actually needed.

Do not create empty folder structures merely for symmetry.

---

# 6. Example Admin Feature Structure

A mature Admin Clients feature may look like:

```text
apps/admin/src/features/clients/
├── api/
│   ├── clients.api.js
│   ├── documents.api.js
│   ├── services.api.js
│   ├── companies.api.js
│   ├── drivers.api.js
│   ├── members.api.js
│   └── vehicles.api.js
│
├── hooks/
│   ├── useClients.js
│   ├── useClient.js
│   ├── useCreateClient.js
│   ├── useUpdateClient.js
│   ├── useAddClientDocument.js
│   ├── useDeleteClientDocument.js
│   ├── useCreateClientService.js
│   └── ...
│
├── components/
│   ├── client-detail/
│   ├── create-client/
│   └── ClientResults.jsx
│
├── constants/
│   ├── client.constants.js
│   └── queryKeys.js
│
├── pages/
│   ├── ClientsPage.jsx
│   ├── ClientDetailPage.jsx
│   └── AddNewClientPage.jsx
│
├── schemas/
│   └── client.schema.js
│
└── utils/
    └── ...
```

Use domain ownership when deciding where a file belongs.

Ask:

> Which business feature owns this code?

Do not decide location based only on whether the file is a hook, component, validator, or utility.

---

# 7. React Query Hooks

React Query hooks belong inside the feature that owns the data.

Correct:

```text
apps/admin/src/features/clients/hooks/useClient.js
apps/admin/src/features/finance/hooks/useProfitLoss.js
apps/admin/src/features/renewals/hooks/useRenewals.js
```

Avoid creating one giant global folder:

```text
src/hooks/
```

for all future feature hooks.

Application-wide generic hooks may still live outside features if they are genuinely cross-cutting.

Examples:

```text
src/hooks/useDebouncedValue.js
```

may remain global if it is used by unrelated features.

---

# 8. Hooks Should Stay Thin

React Query hooks should mainly handle:

* `useQuery`
* `useMutation`
* query keys
* cache invalidation
* frontend query lifecycle
* query options

Do not place large HTTP implementations directly inside hooks.

Preferred:

```js
const mutation = useMutation({
  mutationFn: (formData) =>
    addClientDocument(clientId, formData),
});
```

Not:

```js
const mutation = useMutation({
  mutationFn: async () => {
    // large Axios implementation
    // payload transformation
    // business logic
    // unrelated validation
  },
});
```

Request implementation belongs in the feature's `api/` folder.

---

# 9. Query Keys

React Query keys should be centralized per feature.

Example:

```text
features/clients/constants/queryKeys.js
```

Preferred pattern:

```js
export const clientKeys = {
  all: ["clients"],

  lists: () => [
    ...clientKeys.all,
    "list",
  ],

  list: (filters = {}) => [
    ...clientKeys.lists(),
    filters,
  ],

  details: () => [
    ...clientKeys.all,
    "detail",
  ],

  detail: (clientId) => [
    ...clientKeys.details(),
    clientId,
  ],
};
```

Do not scatter query-key constants across multiple unrelated hook files.

When refactoring query keys, preserve existing cache behavior unless intentionally changing it.

---

# 10. Shared ShadCN Components

All generic ShadCN UI primitives belong in:

```text
packages/ui/src/components/
```

Examples:

```text
button.tsx
card.tsx
dialog.tsx
input.tsx
select.tsx
table.tsx
tabs.tsx
tooltip.tsx
sidebar.tsx
sheet.tsx
popover.tsx
```

Admin and Client must import shared ShadCN components from:

```js
@operio/ui/components/...
```

Example:

```js
import { Button } from "@operio/ui/components/button";
```

Do not import shared ShadCN components using:

```js
@/components/ui/button
```

unless that component intentionally exists locally in that application.

---

# 11. ShadCN Utility Path

The shared ShadCN `cn()` utility lives at:

```text
packages/ui/src/lib/utils.ts
```

Import using:

```js
import { cn } from "@operio/ui/lib/utils";
```

Do not use:

```js
import { cn } from "@/lib/utils";
```

for shared ShadCN components.

---

# 12. Shared ShadCN Hooks

Generic UI hooks used by ShadCN components live inside:

```text
packages/ui/src/hooks/
```

Example:

```text
packages/ui/src/hooks/use-mobile.ts
```

Import using:

```js
import { useIsMobile } from "@operio/ui/hooks/use-mobile";
```

---

# 13. Adding New ShadCN Components

This is a monorepo.

Do not run:

```bash
npx shadcn@latest add button
```

from the repository root without specifying a workspace.

For shared ShadCN primitives, run from the monorepo root:

```bash
npx shadcn@latest add <component> -c packages/ui
```

Example:

```bash
npx shadcn@latest add popover -c packages/ui
```

Shared primitives should normally be installed into:

```text
packages/ui
```

For an application-specific ShadCN block, use the appropriate application workspace:

```bash
npx shadcn@latest add <block> -c apps/admin
```

or:

```bash
npx shadcn@latest add <block> -c apps/client
```

Use judgment:

Generic reusable primitive:

```text
packages/ui
```

Application-specific composition/block:

```text
apps/admin
```

or:

```text
apps/client
```

---

# 14. Shared UI Styles

Shared global design-system styles live at:

```text
packages/ui/src/styles/globals.css
```

Each application should import them from its main entry file.

Example:

```js
import "@operio/ui/globals.css";
```

Typical location:

```text
apps/admin/src/main.jsx
apps/client/src/main.jsx
```

Application-specific CSS may also be imported after shared styles.

Example:

```js
import "@operio/ui/globals.css";
import "./index.css";
```

Shared styles should load before application-specific overrides.

---

# 15. App-Specific Components

Do not move business-specific components into `packages/ui`.

Examples that should normally remain inside an application:

```text
AppSidebar
NavMain
ClientProfileCard
RenewalTable
ProfitLossStatement
CompanyDirectory
ClientSetupSidebar
```

Shared UI should not know about Operio business features.

A good rule:

> Could this component be used in both Admin and Client without knowing anything about Operio business data?

If yes, it may belong in `packages/ui`.

If no, keep it inside the owning feature/application.

---

# 16. Shared API Infrastructure

Shared HTTP/Axios infrastructure lives in:

```text
packages/api/
```

Purpose:

* Axios instance
* API base URL
* shared request configuration
* request interceptors
* response interceptors
* shared authentication transport behavior
* generic HTTP error normalization

Example:

```text
packages/api/
├── src/
│   ├── client.js
│   ├── interceptors.js
│   └── index.js
├── package.json
└── tsconfig.json
```

Import the shared client using:

```js
import { apiClient } from "@operio/api";
```

---

# 17. Admin and Client APIs Must Stay Separate

`packages/api` should not become one giant collection of every backend endpoint.

Admin-specific API functions belong in:

```text
apps/admin/src/features/*/api/
```

Client-specific API functions belong in:

```text
apps/client/src/features/*/api/
```

Example:

```text
apps/admin/src/features/clients/api/clients.api.js
```

Example:

```text
apps/client/src/features/documents/api/documents.api.js
```

Both may use:

```js
import { apiClient } from "@operio/api";
```

Correct dependency flow:

```text
Admin feature API
        │
        ▼
@operio/api

Client feature API
        │
        ▼
@operio/api
```

Do not put application-specific endpoint definitions in the shared API package unless they are genuinely shared.

---

# 18. Avoid Giant Service Files

Do not create or grow large service files such as:

```text
client.service.js
```

containing dozens of unrelated methods.

Prefer splitting API functions by resource.

Example:

```text
features/clients/api/
├── clients.api.js
├── documents.api.js
├── companies.api.js
├── services.api.js
├── members.api.js
├── drivers.api.js
└── vehicles.api.js
```

This makes the code easier to search, test, and maintain.

---

# 19. Shared Utils

Generic reusable utility functions belong in:

```text
packages/utils/
```

Examples:

```text
date formatting
currency formatting
AED formatting
file size formatting
file extension helpers
expiry calculations
generic string helpers
generic status formatting
```

Possible functions:

```js
formatDate()
formatAED()
formatFileSize()
daysUntil()
isExpired()
isExpiringSoon()
```

Do not place React components, React Query hooks, Axios endpoint definitions, or feature-specific business logic inside `packages/utils`.

---

# 20. Feature-Specific Utils

Feature-specific transformation or business helpers stay inside the owning feature.

Example:

```text
apps/admin/src/features/clients/utils/clientCreation.js
apps/admin/src/features/clients/utils/clientVehicleUpdate.js
apps/admin/src/features/clients/utils/clientServiceCreate.js
```

Do not move these into `packages/utils` merely because they are functions.

Shared packages should contain code that is genuinely reusable across applications/features.

---

# 21. Validation / Schemas

Validation belongs with the feature that owns the data.

Example:

```text
apps/admin/src/features/clients/schemas/client.schema.js
apps/admin/src/features/finance/schemas/finance.schema.js
apps/admin/src/features/auth/schemas/auth.schema.js
```

Do not create a shared validation package until a schema is genuinely used by both applications.

---

# 22. Constants

Feature-specific constants belong inside the feature.

Example:

```text
features/clients/constants/
features/finance/constants/
features/renewals/constants/
```

Only truly application-wide constants should live globally.

---

# 23. Import Aliases

Inside an application:

```text
@
```

means that application's `src` directory.

For Admin:

```text
@ → apps/admin/src
```

For Client:

```text
@ → apps/client/src
```

Examples:

```js
import { clientKeys } from "@/features/clients/constants/queryKeys";
```

Shared workspace packages must use package imports.

Examples:

```js
import { Button } from "@operio/ui/components/button";
import { cn } from "@operio/ui/lib/utils";
import { apiClient } from "@operio/api";
```

Do not change `@` to point to the repository root.

Do not change `@` to point to `packages/ui`.

---

# 24. Dependency Direction

Shared packages may be imported by applications.

Correct:

```text
apps/admin
    ↓
packages/ui

apps/admin
    ↓
packages/api

apps/client
    ↓
packages/ui

apps/client
    ↓
packages/api
```

Incorrect:

```text
packages/ui
    ↓
apps/admin
```

or:

```text
packages/api
    ↓
apps/client
```

Shared packages must never import application code.

Dependency direction should always be:

```text
apps → packages
```

Never:

```text
packages → apps
```

---

# 25. Avoid Circular Dependencies

Preferred feature dependency flow:

```text
page
 ↓
component
 ↓
hook
 ↓
feature API
 ↓
@operio/api
```

Avoid:

```text
API → hook
hook → page
utils → React page
shared package → application feature
```

Avoid unnecessary barrel files if they introduce circular imports.

---

# 26. Package Installation Rules

This repository uses npm workspaces.

Always install packages from the repository root unless there is a very specific reason not to.

Do not run separate `npm install` commands inside each application as a normal workflow.

---

## Install dependency for Admin only

Run:

```bash
npm install <package> --workspace=@operio/admin
```

Example:

```bash
npm install recharts --workspace=@operio/admin
```

This package belongs to Admin.

---

## Install dependency for Client only

Run:

```bash
npm install <package> --workspace=@operio/client
```

Example:

```bash
npm install react-hook-form --workspace=@operio/client
```

---

## Install dependency for Shared UI

Run:

```bash
npm install <package> --workspace=@operio/ui
```

If a ShadCN component imports a library, the dependency should normally be declared in `packages/ui/package.json`.

Do not rely accidentally on Admin having the dependency installed.

---

## Install dependency for Shared API

Run:

```bash
npm install <package> --workspace=@operio/api
```

Example:

```bash
npm install axios --workspace=@operio/api
```

---

# 27. Dependency Ownership Rule

If code inside a workspace directly imports a package, that workspace should declare the dependency.

Example:

If:

```text
packages/ui/src/components/example.tsx
```

contains:

```js
import { Something } from "some-package";
```

then:

```text
packages/ui/package.json
```

should declare `some-package`.

Do not depend on npm hoisting as an implicit dependency.

---

# 28. React in Shared UI

Reusable UI packages should avoid creating a second independent React installation.

React and React DOM may be configured as peer dependencies where appropriate.

Do not make dependency changes blindly.

Check existing package configuration first.

---

# 29. Root Commands

Run commands from the repository root.

Typical commands:

```bash
npm install
```

Run Admin:

```bash
npm run dev:admin
```

Run Client:

```bash
npm run dev:client
```

Build Admin:

```bash
npm run build:admin
```

Build Client:

```bash
npm run build:client
```

Use the root `package.json` scripts whenever possible.

---

# 30. Environment Variables

Each application may have its own:

```text
apps/admin/.env.local
apps/client/.env.local
```

Do not move frontend secrets into shared packages.

Remember that Vite variables prefixed with:

```text
VITE_
```

are exposed to client-side code.

Never put secrets, passwords, private API keys, or database credentials in Vite-exposed environment variables.

---

# 31. Preserve Backend Contracts

Refactoring frontend structure must not silently change backend behavior.

Do not change without explicit reason:

* API URLs
* request methods
* payload property names
* query parameters
* response extraction
* authentication behavior
* cookie behavior
* headers
* refresh-token logic

When moving an API function, inspect the existing implementation and preserve behavior.

Do not guess endpoint names.

---

# 32. Preserve Existing Behavior During Refactors

Architecture work should not become a product rewrite.

When moving files:

* preserve behavior
* preserve routes
* preserve React Query cache behavior
* preserve forms
* preserve validation
* preserve loading/error states
* preserve permissions
* preserve authentication
* preserve API contracts

Avoid rewriting working code merely because a different style is preferred.

---

# 33. UI Refactor Rules

Do not redesign the application while moving files.

A structural refactor should remain structurally focused.

Do not combine:

```text
architecture migration
+
visual redesign
+
API redesign
+
state-management rewrite
```

unless explicitly requested.

Keep changes scoped.

---

# 34. Sidebar and Layout

The shared ShadCN Sidebar primitive lives at:

```text
packages/ui/src/components/sidebar.tsx
```

Admin-specific sidebar composition lives inside Admin.

Example:

```text
apps/admin/src/components/app-sidebar.tsx
apps/admin/src/components/nav-main.tsx
```

Do not move Admin navigation/business configuration into the shared UI package.

The shared Sidebar provides generic behavior.

The Admin application provides:

* menu items
* navigation structure
* permissions
* route links
* Operio-specific labels

---

# 35. Shared Sidebar Imports

Use:

```js
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@operio/ui/components/sidebar";
```

Do not use old paths such as:

```js
@/components/ui/sidebar
```

after the component has been moved into `packages/ui`.

The same applies to:

```text
button
input
sheet
tooltip
separator
skeleton
popover
```

and all other shared ShadCN primitives.

---

# 36. Shared Package Internal Imports

Code inside `packages/ui` should use shared package paths or valid local relative imports.

Preferred:

```js
import { cn } from "@operio/ui/lib/utils";
import { Button } from "@operio/ui/components/button";
```

Avoid application aliases such as:

```js
@/components/ui/button
@/lib/utils
```

inside shared packages.

Those aliases belong to applications, not shared workspaces.

---

# 37. Pages

Pages should normally live inside their owning feature.

Example:

```text
features/clients/pages/ClientsPage.jsx
features/finance/pages/FinancePage.jsx
features/renewals/pages/RenewalsPage.jsx
```

Application-wide pages/layouts may remain outside features.

Examples:

```text
src/app/Layout.jsx
src/pages/NotFoundPage.jsx
```

Use judgment.

---

# 38. Routing

Application routing remains application-specific.

Admin routes belong inside:

```text
apps/admin/src/routes/
```

Client routes belong inside:

```text
apps/client/src/routes/
```

Do not create shared application routing inside `packages`.

Shared packages should not know which URL paths Admin or Client use.

---

# 39. Redux / Application Store

Existing centralized Redux store structure may remain centralized.

Do not refactor Redux architecture during unrelated tasks.

If moving feature slices becomes useful later, treat that as a separate task.

Avoid combining multiple architectural migrations unless explicitly requested.

---

# 40. File Naming

Prefer descriptive names.

Examples:

```text
clients.api.js
documents.api.js
queryKeys.js
client.schema.js
useCreateClient.js
ClientDetailPage.jsx
```

Avoid vague files such as:

```text
helpers.js
common.js
misc.js
stuff.js
service.js
```

unless the scope is genuinely clear.

---

# 41. Avoid Premature Shared Code

Do not move something into `packages` simply because both applications might someday use it.

Share code when it is actually reusable.

Duplication is sometimes safer than creating a poorly designed shared abstraction too early.

Shared packages should remain stable and generic.

---

# 42. When Refactoring Existing Code

Prefer this sequence:

```text
1. Inspect existing implementation
2. Understand dependencies
3. Move files
4. Update imports
5. Preserve behavior
6. Build
7. Fix remaining references
8. Remove obsolete files
```

Do not delete old files before all imports have been migrated.

---

# 43. Search Before Creating New Code

Before creating:

* a new hook
* a new component
* a new utility
* a new API function
* a new validation schema
* a new constant

search the repository first.

Avoid duplicate implementations.

Examples:

Before creating another date formatter, check:

```text
packages/utils
```

Before creating a button, check:

```text
packages/ui
```

Before creating another API client, check:

```text
packages/api
```

---

# 44. Build Verification

After significant structural changes, always run the relevant production build.

For Admin:

```bash
npm run build:admin
```

For Client:

```bash
npm run build:client
```

If shared packages were changed and both applications consume them, preferably build both.

Do not claim a refactor is complete if the affected application cannot build.

---

# 45. Linting

Run relevant lint commands if they are configured and currently functional.

If lint fails due to pre-existing unrelated issues, report those separately.

Do not rewrite unrelated code merely to make a broad lint command pass unless explicitly asked.

---

# 46. Git / File Moves

When moving existing files, preserve content where possible.

Avoid deleting and recreating large files unnecessarily.

File moves make Git history easier to follow.

Keep refactor commits focused when practical.

---

# 47. Do Not Introduce New Architecture Without Need

Do not automatically add:

* Turborepo
* Nx
* additional state libraries
* new HTTP libraries
* another UI system
* another form library
* another validation library
* extra workspace tooling

unless requested or clearly necessary.

The existing stack should be preferred.

---

# 48. Current Core Stack

The project uses technologies including:

```text
Vite
React
npm workspaces
React Router
TanStack React Query
Redux Toolkit
Axios
ShadCN
Tailwind CSS
React Hook Form
Joi / Yup where already used
```

Prefer existing technologies before introducing alternatives.

---

# 49. Human Readability Matters

Code structure should be understandable without requiring tribal knowledge.

A developer should be able to look at:

```text
features/clients/
```

and find most client-related Admin code there.

Avoid architecture that relies on hidden conventions or excessive abstraction.

---

# 50. Decision Guide

When deciding where a new file belongs, use this order.

## Is it a generic reusable UI primitive?

Put it in:

```text
packages/ui
```

## Is it generic shared HTTP infrastructure?

Put it in:

```text
packages/api
```

## Is it a pure reusable helper used across applications/features?

Put it in:

```text
packages/utils
```

## Is it Admin business logic?

Put it in:

```text
apps/admin/src/features/<domain>
```

## Is it Client business logic?

Put it in:

```text
apps/client/src/features/<domain>
```

## Is it application-wide infrastructure?

Keep it under the relevant application's:

```text
src/app
src/routes
src/store
```

as appropriate.

---

# 51. Example Dependency Model

Preferred:

```text
Admin Page
    ↓
Admin Feature Component
    ↓
Admin Feature Hook
    ↓
Admin Feature API
    ↓
@operio/api
    ↓
Backend
```

UI dependency:

```text
Admin Component
    ↓
@operio/ui
```

Utility dependency:

```text
Admin / Client Feature
    ↓
@operio/utils
```

---

# 52. Important Rule Summary

Always follow these core rules:

1. Organize application code by feature/domain.
2. Keep Admin and Client application logic separate.
3. Keep shared ShadCN primitives in `packages/ui`.
4. Import shared UI via `@operio/ui/...`.
5. Keep React Query hooks inside their owning feature.
6. Keep Admin APIs inside Admin features.
7. Keep Client APIs inside Client features.
8. Keep only shared Axios infrastructure in `packages/api`.
9. Put only genuinely reusable pure helpers in `packages/utils`.
10. Install dependencies in the workspace that actually uses them.
11. Read `docs/design.md` before making design changes.
12. Preserve existing behavior during refactors.
13. Avoid shared packages importing application code.
14. Build affected applications after significant changes.
15. Do not create unnecessary abstractions or dependencies.

---

# 53. Before Finishing an Agent Task

Before marking a coding task complete, verify:

* imports resolve
* affected application builds
* no stale old paths remain
* ShadCN imports use the correct package
* dependencies are declared in the correct workspace
* feature files are placed in the owning feature
* APIs still use the existing backend contract
* React Query invalidation still works
* routes still resolve
* no shared package imports application code
* no accidental duplicate components/services/utilities were created
* design changes, if any, follow `docs/design.md`

If any of these could not be verified, explicitly report it.

---

# 54. General Philosophy

The architecture should optimize for:

```text
clear ownership
+
predictable file locations
+
safe reuse
+
independent Admin/Client development
+
minimal duplication
+
easy future maintenance
```

Prefer simple boundaries over clever abstractions.

The monorepo should make code easier to find, not harder.
