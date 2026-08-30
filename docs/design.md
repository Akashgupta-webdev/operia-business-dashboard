# Insurance CRM — Product Design System

**Version:** 1.0
**Status:** Active
**Purpose:** Single source of truth for the Insurance CRM user interface.

---

## 1. Design Philosophy

The Insurance CRM is a professional, data-heavy business application used by insurance agents and administrators to manage clients, policies, renewals, vehicles, drivers, companies, documents, follow-ups, and related operational data.

The interface must prioritize:

1. Clarity
2. Information density
3. Fast scanning
4. Consistency
5. Accessibility
6. Predictability
7. Low cognitive load
8. Responsive behavior
9. Performance
10. Professional appearance

### Core Principle

> The UI should help an insurance agent complete work faster, not compete for the user's attention.

### Design Characteristics

The interface should feel:

* Professional
* Reliable
* Calm
* Structured
* Modern
* Data-oriented
* Trustworthy
* Efficient

The interface should avoid feeling:

* Playful
* Overly colorful
* Marketing-oriented
* Excessively animated
* Visually noisy
* Over-rounded
* Overly decorative

---

# 2. Product Design Direction

## 2.1 Visual Style

Use a modern enterprise SaaS visual language.

Recommended characteristics:

* Neutral application background
* White or near-white surfaces in light mode
* Dark neutral surfaces in dark mode
* One primary brand color
* Limited semantic colors
* Medium-density layouts
* Subtle borders
* Minimal shadows
* Small-to-medium border radius
* Clear hierarchy
* Strong typography
* Consistent spacing

The CRM should visually communicate:

> "Professional business software that can be trusted with important insurance data."

---

# 3. Design Tokens

All visual properties must be represented as reusable design tokens.

Do not hardcode arbitrary values throughout components.

Tokens should be implemented using CSS variables/Tailwind theme tokens.

---

# 4. Color System

## 4.1 Color Philosophy

The color system consists of:

* Brand colors
* Neutral colors
* Semantic colors
* Interactive colors
* Data visualization colors

Colors must communicate meaning.

Do not use color only for decoration.

---

## 4.2 Primary Brand Color

Recommended primary direction:

**Indigo / Blue**

Reason:

* Professional
* Trust-oriented
* Works well for enterprise applications
* Good compatibility with insurance/finance products
* Works well in both light and dark themes

Example palette:

```text
Primary 50:  #EEF2FF
Primary 100: #E0E7FF
Primary 200: #C7D2FE
Primary 300: #A5B4FC
Primary 400: #818CF8
Primary 500: #6366F1
Primary 600: #4F46E5
Primary 700: #4338CA
Primary 800: #3730A3
Primary 900: #312E81
```

Primary 600 should generally be the default action color.

Use primary colors for:

* Primary buttons
* Active navigation
* Selected tabs
* Links
* Focus indicators
* Important interactive elements
* Selected filters

Do not use primary color for large decorative backgrounds.

---

# 5. Neutral Color System

The majority of the CRM UI should use neutral colors.

Suggested neutral scale:

```text
Neutral 0:    #FFFFFF
Neutral 50:   #F8FAFC
Neutral 100:  #F1F5F9
Neutral 200:  #E2E8F0
Neutral 300:  #CBD5E1
Neutral 400:  #94A3B8
Neutral 500:  #64748B
Neutral 600:  #475569
Neutral 700:  #334155
Neutral 800:  #1E293B
Neutral 900:  #0F172A
Neutral 950:  #020617
```

Neutral colors should be used for:

* Backgrounds
* Borders
* Text
* Icons
* Secondary surfaces
* Disabled states
* Dividers

---

# 6. Semantic Colors

Semantic colors communicate system state.

## Success

```text
Success 50:  #F0FDF4
Success 100: #DCFCE7
Success 500: #22C55E
Success 600: #16A34A
Success 700: #15803D
```

Use for:

* Active policies
* Completed tasks
* Successful payments
* Completed actions
* Positive confirmations

---

## Warning

```text
Warning 50:  #FFFBEB
Warning 100: #FEF3C7
Warning 500: #F59E0B
Warning 600: #D97706
Warning 700: #B45309
```

Use for:

* Expiring policies
* Pending actions
* Approaching renewals
* Incomplete information

---

## Danger

```text
Danger 50:  #FEF2F2
Danger 100: #FEE2E2
Danger 500: #EF4444
Danger 600: #DC2626
Danger 700: #B91C1C
```

Use for:

* Errors
* Failed operations
* Expired policies
* Destructive actions
* Validation failures

---

## Information

```text
Info 50:  #EFF6FF
Info 100: #DBEAFE
Info 500: #3B82F6
Info 600: #2563EB
Info 700: #1D4ED8
```

Use for:

* Informational messages
* Helpful hints
* System notifications
* Non-critical status information

---

## Data Visualization Palette

Charts need their own restrained, ordered palette — separate from semantic colors, since a chart series is not a system state.

```text
Series 1: #4F46E5  (primary-600 — default/first series)
Series 2: #0EA5E9  (sky)
Series 3: #14B8A6  (teal)
Series 4: #F59E0B  (amber — only when not implying "warning")
Series 5: #8B5CF6  (violet)
Series 6: #EC4899  (pink — last resort, use sparingly)
```

Rules:

* Never reuse a semantic color (success/warning/danger) in a chart unless the chart is explicitly status-based (e.g. a policy status breakdown), in which case use the matching semantic color intentionally.
* Categorical charts: cycle through Series 1–6 in order, never randomly.
* Sequential/heatmap data (e.g. renewal density by week): use a single-hue ramp from Primary 100 → Primary 700, not a rainbow scale.
* Diverging data (e.g. profit/loss): Danger 500 → Neutral 200 → Success 500.
* Maximum 6 series on one chart. Beyond that, group into "Other."

---

# 7. Color Usage Rules

Never introduce a new random color inside an individual component.

Bad:

```text
Button A → #4567EF
Button B → #4872FF
Button C → #536AFF
```

Good:

```text
Primary Button → primary-600
Secondary Button → neutral
Danger Button → danger-600
```

Every color must have a defined semantic purpose.

---

# 8. Light Theme

## Application

```text
App Background:       neutral-50
Primary Surface:      white
Secondary Surface:    neutral-100
Border:               neutral-200
Primary Text:         neutral-900
Secondary Text:       neutral-600
Muted Text:           neutral-500
```

The main application should not be pure white everywhere.

Recommended hierarchy:

```text
Page Background
    ↓
Card / Surface
    ↓
Nested Surface
    ↓
Interactive Element
```

This creates depth without relying heavily on shadows.

---

# 9. Dark Theme

Dark mode must not simply invert colors.

Recommended direction:

```text
App Background:       neutral-950
Primary Surface:      neutral-900
Secondary Surface:    neutral-800
Border:               neutral-700
Primary Text:         neutral-100
Secondary Text:       neutral-400
Muted Text:           neutral-500
```

Avoid pure black backgrounds such as:

```text
#000000
```

for the entire application.

Use dark neutral surfaces instead.

---

# 10. Theme Rules

Components must use semantic tokens instead of direct light/dark colors.

Example:

```text
background: var(--surface-primary)
color: var(--text-primary)
border: var(--border-default)
```

Do not create:

```text
background: white
```

inside reusable components.

The same component must work in both themes.

---

# 11. Typography

## 11.1 Font

Recommended primary font:

**Inter**

Fallback:

```text
Inter, ui-sans-serif, system-ui, sans-serif
```

Reason:

* Excellent readability
* Strong numerical rendering
* Good UI typography
* Works well for dense business applications
* Excellent support across modern browsers

---

# 12. Typography Scale

```text
Display:
48px / 56px / 700

Page Heading:
30px / 38px / 700

Section Heading:
24px / 32px / 600

Subsection:
20px / 28px / 600

Large Body:
18px / 28px / 400

Body:
14px / 20px / 400

Small:
13px / 18px / 400

Caption:
12px / 16px / 400
```

For a CRM, 14px should be the primary UI text size.

Do not make the entire dashboard 16px by default.

---

# 13. Font Weight

```text
400 → Regular
500 → Medium
600 → Semibold
700 → Bold
```

Recommended usage:

```text
Body              → 400
Labels            → 500
Navigation        → 500
Table headers     → 500/600
Section headings  → 600
Page headings     → 700
Important values  → 600
```

Avoid excessive use of 700 weight.

---

# 14. Numbers and Data

Insurance CRM contains many numbers:

* Premium
* Policy amount
* Vehicle registration
* Phone numbers
* Dates
* Renewal periods
* Counts
* Financial values

Numbers must be visually scannable.

Use:

```text
font-variant-numeric: tabular-nums;
```

where aligned numerical comparison is required.

Examples:

* Dashboard statistics
* Tables
* Financial values
* Policy numbers
* Dates

---

# 15. Spacing System

Use a consistent 4px base spacing system.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

Preferred spacing:

```text
Icon → text:          8px
Input internal gap:   12px
Form field gap:       16px
Card padding:         20-24px
Section gap:          24-32px
Page section gap:     32-40px
```

Avoid arbitrary spacing such as:

```text
13px
17px
23px
29px
37px
```

unless there is a strong reason.

---

# 16. Layout

## Desktop

Primary application layout:

```text
┌─────────────────────────────────────────────┐
│ Top Bar                                     │
├──────────────┬──────────────────────────────┤
│              │                              │
│ Sidebar      │ Main Content                 │
│              │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

Recommended:

```text
Sidebar:
240px expanded
72px collapsed

Main content:
Flexible

Page max-width:
None for data-heavy pages
Optional max-width for focused forms
```

Do not unnecessarily constrain large tables to a narrow max-width.

---

# 17. Responsive Breakpoints

Use:

```text
xs:  480px
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

Primary design targets:

### Mobile

```text
< 640px
```

### Tablet

```text
640px - 1023px
```

### Desktop

```text
1024px+
```

### Large Desktop

```text
1280px+
```

---

# 18. Responsive Philosophy

Do not simply shrink desktop layouts.

Adapt the information architecture.

Desktop:

```text
Sidebar
+
Multiple columns
+
Large tables
```

Mobile:

```text
Bottom navigation / compact navigation
+
Single column
+
Stacked content
+
Card-based data
+
Horizontal scrolling where necessary
```

---

# 19. Mobile CRM Rules

Mobile should prioritize:

1. Client information
2. Follow-ups
3. Policies
4. Renewals
5. Tasks
6. Important actions

Secondary information can move into:

* Tabs
* Drawers
* Expandable sections
* Detail pages

Do not attempt to display every desktop field on mobile.

---

# 20. Border Radius

Use moderate rounding.

Recommended:

```text
xs: 4px
sm: 6px
md: 8px
lg: 10px
xl: 12px
2xl: 16px
```

Default:

```text
8px
```

Use:

```text
8px → inputs, buttons, cards
10-12px → larger containers
16px → prominent dashboard cards
```

Avoid excessive `rounded-full`.

Use full-radius only for:

* Avatars
* Status indicators
* Pills
* Circular icon buttons

---

# 21. Borders

Default border:

```text
1px solid neutral-200
```

Dark:

```text
1px solid neutral-700
```

Borders should be subtle.

Use borders primarily for:

* Input boundaries
* Cards
* Tables
* Dividers
* Navigation sections

Avoid putting borders around every small element.

---

# 22. Shadows

Use shadows sparingly.

Recommended:

```text
sm → dropdowns
md → dialogs
lg → important overlays
```

Cards should generally rely on:

```text
background + border
```

rather than:

```text
large shadow + gradient + border
```

This keeps the CRM professional and reduces visual noise.

---

# 23. Elevation

Use four levels:

```text
Level 0 → Flat surface
Level 1 → Card
Level 2 → Dropdown / popover
Level 3 → Modal / dialog
```

Every component should have a predictable elevation level.

---

# 24. Buttons

## Primary

Used for the most important action.

Examples:

```text
Add Client
Create Policy
Save Changes
Generate Quotation
```

Style:

```text
Primary background
White text
Medium weight
8px radius
```

---

## Secondary

Used for supporting actions.

Examples:

```text
Cancel
Export
Filter
View Details
```

Style:

```text
Transparent / neutral surface
Neutral border
Neutral text
```

---

## Destructive

Examples:

```text
Delete Client
Delete Policy
Remove Document
```

Never make destructive actions look identical to primary actions.

---

# 25. Button States

Every interactive button must support:

```text
Default
Hover
Active
Focus
Disabled
Loading
```

Example:

```text
Default → primary-600
Hover → primary-700
Active → primary-800
Disabled → reduced contrast
Loading → spinner + disabled interaction
```

Never allow a button to visually appear clickable while disabled.

---

# 26. Forms

Forms are one of the most important components in this CRM.

Form hierarchy:

```text
Section
    ↓
Field Group
    ↓
Label
    ↓
Input
    ↓
Helper / Error Text
```

Default field spacing:

```text
16px
```

---

# 27. Input Design

Default:

```text
Height: 40px
Radius: 8px
Border: 1px
Padding: 12px
Font: 14px
```

Large inputs:

```text
Height: 44px
```

Do not use extremely tall inputs in data-heavy forms.

---

# 28. Input States

Every input must support:

```text
Default
Hover
Focus
Filled
Disabled
Read-only
Error
Success
```

Focus must be clearly visible.

Recommended:

```text
border + focus ring
```

Do not rely only on changing the border color.

---

# 29. Labels

Labels should always clearly identify the field.

Example:

```text
Policy Number *
[________________________]

Policy expires on
[________________________]
```

Do not rely solely on placeholder text as the label.

---

# 30. Tables

Tables are critical to the CRM.

Primary goals:

* Fast scanning
* Sorting
* Filtering
* Consistent alignment
* High information density

Recommended row height:

```text
44px - 52px
```

Header:

```text
40px - 44px
```

---

# 31. Table Alignment

Text:

```text
Left
```

Numbers:

```text
Right
```

Status:

```text
Center / Left depending on context
```

Actions:

```text
Right
```

Dates:

```text
Left or center depending on column density
```

---

# 32. Table Interaction

Support:

* Row hover
* Sorting
* Filtering
* Pagination
* Column visibility
* Search
* Bulk selection where required
* Empty state
* Loading state

Row hover should be subtle.

Do not dramatically change the row background.

---

# 33. Status Badges

Status should be immediately scannable.

Examples:

```text
Active
Pending
Expired
Cancelled
Renewal Due
Draft
Completed
Failed
```

Recommended style:

```text
small text
medium weight
subtle background
semantic text color
6px radius
```

Avoid excessive pill shapes for every piece of information.

---

# 34. Insurance-Specific Status Colors

### Policy

```text
Active        → Success
Pending       → Warning
Expired       → Danger
Cancelled     → Neutral
Draft         → Neutral
```

### Renewal

```text
> 30 days     → Neutral/Info
7-30 days     → Warning
< 7 days      → Danger
Expired       → Danger
Renewed       → Success
```

### Lead

```text
New           → Info
Contacted     → Neutral
Interested    → Primary
Quotation     → Warning
Won           → Success
Lost          → Danger
```

Status semantics must remain consistent throughout the application.

---

# 35. Cards

Cards should group related information.

Good:

```text
Client Information
------------------
Name
Phone
Email
Address
```

Bad:

```text
Card
inside card
inside card
inside card
```

Avoid excessive nesting.

---

# 36. Dashboard Cards

Dashboard KPI cards should communicate:

```text
Metric
Current value
Optional comparison
Optional trend
```

Example:

```text
Active Policies

1,284

+8.4% from last month
```

Do not add a chart to every KPI card.

A visual should only exist when it communicates useful information.

---

# 37. Navigation

Sidebar should prioritize task frequency.

Recommended structure:

```text
Dashboard

CRM
  Clients
  Leads
  Companies

Insurance
  Policies
  Quotations
  Renewals
  Claims

Operations
  Tasks
  Follow-ups
  Documents

Reports

Administration
  Users
  Roles
  Settings
```

Do not put every page at the same navigation level.

---

# 38. Active Navigation

Active navigation should use:

* Primary color
* Subtle background
* Strong text
* Optional icon emphasis

Example:

```text
Inactive:
neutral text

Active:
primary text
primary subtle background
```

Avoid excessive glowing or animated navigation.

---

# 39. Icons

Recommended icon library:

**Lucide**

Rules:

* Consistent stroke width
* Consistent size
* Never mix unrelated icon styles
* Icons must support meaning
* Do not use icons purely for decoration everywhere

Standard sizes:

```text
12px → compact metadata
14px → small UI
16px → default
18px → prominent UI
20px → navigation
24px → major actions
```

---

# 40. Icon + Text

For actions:

```text
[Icon] Export
[Icon] Add Client
[Icon] Delete
```

Do not use an icon alone when the action may be ambiguous.

Icon-only buttons require:

* Tooltip
* Accessible label
* Clear visual affordance

---

# 41. Modals

Use modals for:

* Confirmation
* Short forms
* Important focused actions

Do not use modals for large workflows.

Large workflows should use:

* Full page
* Drawer
* Dedicated detail page

Recommended modal widths:

```text
Small: 400px
Medium: 520px
Large: 720px
Extra Large: 960px
```

---

# 42. Drawers

Use drawers for contextual editing.

Examples:

```text
Client quick view
Policy details
Activity history
Document preview
```

Drawer should preserve context behind it.

---

# 43. Client Detail Page

Client detail should be one of the strongest UX patterns in the CRM.

Recommended structure:

```text
Client Header
│
├── Overview
├── Personal Information
├── Insurance
├── Vehicles
├── Drivers
├── Documents
├── Companies
├── Activities
└── Notes
```

The user should be able to understand the client's current state quickly.

---

# 44. Information Hierarchy

Every page should have:

```text
Page title
    ↓
Page description / context
    ↓
Primary action
    ↓
Filters / controls
    ↓
Main content
```

Do not make users visually search for the primary action.

---

# 45. Search

Global search should eventually support:

```text
Client
Policy
Vehicle
Company
Phone
Email
Policy number
Registration number
```

Search should provide:

* Keyboard interaction
* Recent searches
* Categorized results
* Loading state
* No-result state

---

# 46. Filters

Filters should be visually separated from the data.

Common filters:

```text
Status
Agent
Company
Policy type
Renewal date
Created date
```

Use:

```text
Filter button
+
Filter drawer/popover
```

when the number of filters becomes large.

Avoid showing 10+ filter controls permanently above a table.

---

# 47. Empty States

Every data-driven page must have a deliberate empty state.

Example:

```text
No clients found

There are no clients matching your current filters.

[Clear Filters]
```

For genuinely empty modules:

```text
No policies yet

Create your first policy to start tracking coverage.

[Create Policy]
```

Empty states should explain:

1. What happened?
2. Why?
3. What can the user do next?

---

# 48. Loading States

Use skeletons for larger page content.

Examples:

```text
Table skeleton
Card skeleton
Profile skeleton
Dashboard skeleton
```

Avoid displaying spinners for every small interaction.

Use spinners primarily for:

* Button actions
* Short operations
* Small isolated content

Skeleton shimmer motion:

```text
Duration: 1400-1600ms
Easing: linear, looping
Direction: left → right
```

Skeleton surfaces should use `neutral-100` / `neutral-800` base with a lighter sweep — never the brand color, so skeletons don't compete with real content once loaded.

---

# 49. Error States

Errors must be actionable.

Bad:

```text
Something went wrong.
```

Better:

```text
Unable to load policies.

Please try again. If the problem continues, contact your administrator.

[Retry]
```

Never expose raw backend errors to normal users.

---

# 50. Notifications

Use toast notifications for short-lived feedback.

Examples:

```text
Client created successfully.
Policy updated successfully.
Document uploaded successfully.
```

Do not use toasts for critical information that users must retain.

Critical information belongs in the page UI.

Toast behavior:

```text
Position:      top-right (desktop), top-center (mobile)
Duration:      Success/Info → 4s · Warning → 6s · Danger/Error → does not auto-dismiss
Stacking:      max 3 visible, newest on top, older collapse into a "+N more"
Dismiss:       manual close (x) always available
Motion:        slide-in + fade, 200ms, respects prefers-reduced-motion
```

---

# 51. Confirmation Dialogs

Use confirmation dialogs for destructive actions.

Example:

```text
Delete client?

This action cannot be undone.

[Cancel] [Delete Client]
```

For high-risk operations, clearly explain consequences.

---

# 52. Hover Behavior

Hover should communicate:

> "This element is interactive."

Use subtle changes:

```text
background
border
text color
shadow
```

Avoid:

* Large transformations
* Scale effects
* Bright flashes
* Excessive animations

CRM applications should feel stable.

---

# 53. Animation

Animation should be functional, not decorative.

Recommended duration:

```text
Fast:    100ms
Default: 150ms
Medium: 200ms
Slow:    300ms
```

Use animation for:

* Dropdown opening
* Modal opening
* Drawer opening
* Tooltip
* Navigation transitions
* Loading transitions

Avoid animation on:

* Every table row
* Every button
* Every card
* Large dashboard elements

Respect:

```text
prefers-reduced-motion
```

---

# 54. Accessibility

Minimum requirements:

* WCAG 2.1 AA contrast — 4.5:1 for body text, 3:1 for large text (18px+/14px bold) and meaningful UI components/icons
* Keyboard navigation for every interactive element, in logical tab order
* Visible focus state (2px ring, primary-600, 2px offset) — never `outline: none` without a replacement
* Proper labels — every input has a programmatically associated `<label>`
* Accessible form errors — announced via `aria-live="polite"`, linked to the field with `aria-describedby`
* Accessible icon buttons — `aria-label` required when no visible text
* Semantic HTML — landmarks (`nav`, `main`, `header`), heading order not skipped
* Screen-reader-friendly status messages — toasts and inline status use `aria-live` regions
* Minimum touch target around 44px where practical

Never communicate meaning using color alone.

Example:

Bad:

```text
Red = expired
```

Better:

```text
[Expired]
```

with red as supporting visual information.

Known contrast risks in this palette — verify before shipping:

```text
Warning-500 (#F59E0B) on white  → fails 4.5:1 for body text; use for icons/badges
                                    with dark text (neutral-900), not as text color itself
Info-500 (#3B82F6) on white     → borderline for small text; prefer info-600/700 for text
```

---

# 55. Touch Targets

Mobile interactive elements should generally have:

```text
minimum ~44px touch target
```

Even when the visual icon is only 20px.

---

# 56. Data Density

Insurance CRM is a productivity application.

Default density:

```text
Medium
```

Provide optional:

```text
Compact
Comfortable
```

where useful, especially for tables.

Compact mode can reduce:

```text
row height
vertical padding
section spacing
```

Do not reduce font size excessively.

---

# 57. Forms With Many Fields

Insurance records can contain many fields.

Do not present a massive form as one continuous page.

Group fields logically.

Example:

```text
Client
├── Personal Information
├── Contact Information
├── Address
├── Identification
│
Insurance
├── Policy Information
├── Coverage
├── Premium
│
Vehicle
├── Vehicle Information
├── Registration
├── Driver Information
│
Documents
├── Identity Documents
├── Policy Documents
└── Supporting Documents
```

Use sections, tabs, or accordions when appropriate.

---

# 58. Progressive Disclosure

Do not show every field immediately.

Show:

```text
Important information first
```

Then allow:

```text
View more
Advanced details
Additional information
```

This is especially important for client and policy records.

---

# 59. Date and Time

Use consistent formatting across the entire application.

Recommended display:

```text
24 Aug 2026
```

For timestamps:

```text
24 Aug 2026, 10:30 AM
```

Do not mix:

```text
08/24/26
24-08-2026
Aug 24, 2026
```

within the same application.

---

# 60. Currency

Currency values must use consistent formatting.

Example:

```text
₹1,25,000
```

or the application's configured currency.

Always maintain consistent:

* Symbol
* Decimal precision
* Thousand separators
* Negative-value formatting

Use the Indian numbering system (lakh/crore grouping — `1,25,000` not `125,000`) throughout tables, dashboards, and exported documents, since this is the convention agents and clients will expect.

---

# 61. Responsive Tables

Do not force extremely wide tables into the viewport.

Options:

1. Horizontal scrolling
2. Hide low-priority columns
3. Column visibility controls
4. Mobile card representation
5. Dedicated mobile detail page

Do not shrink table text until it becomes unreadable.

---

# 62. Desktop Page Structure

Recommended page padding:

```text
1024px+:
24px - 32px

1280px+:
32px

1536px+:
32px - 40px
```

---

# 63. Mobile Page Structure

Recommended:

```text
Horizontal padding:
16px

Section spacing:
24px

Card padding:
16px
```

Avoid excessive whitespace on mobile.

---

# 64. Z-Index System

Do not randomly assign z-index values.

Use a defined scale:

```text
Base:       0
Sticky:     10
Dropdown:   20
Popover:    30
Overlay:    40
Modal:      50
Toast:      60
Tooltip:    70
```

All overlays must follow this hierarchy.

---

# 65. Scroll Behavior

Main application should preferably have:

```text
Fixed sidebar
Fixed/sticky header where useful
Scrollable main content
```

Avoid multiple nested scroll containers unless necessary.

Nested scrolling should be introduced carefully because it can create poor usability.

---

# 66. Page Header Pattern

Standard page header:

```text
┌─────────────────────────────────────────┐
│ Page Title                    [Primary] │
│ Short contextual description            │
└─────────────────────────────────────────┘
```

For example:

```text
Clients                         [+ Add Client]

Manage your insurance clients and their records.
```

---

# 67. Action Hierarchy

Every page should have one obvious primary action.

Example:

Clients:

```text
Primary   → Add Client
Secondary → Export
Secondary → Import
```

Policies:

```text
Primary   → Create Policy
Secondary → Export
```

Do not give five buttons equal visual importance.

---

# 68. Destructive Actions

Destructive actions must:

* Use danger semantic color
* Require confirmation when appropriate
* Clearly describe consequences
* Never be placed immediately beside another destructive action without separation

Examples:

```text
Delete
Archive
Remove
Revoke
Cancel
```

---

# 69. Role-Based UI

The interface should adapt based on permissions.

Example:

Agent:

```text
Clients
Policies
Renewals
Tasks
Documents
```

Administrator:

```text
Users
Roles
Reports
Settings
Audit Logs
```

Do not simply hide unauthorized buttons while allowing the underlying operation.

Backend authorization remains mandatory.

---

# 70. Design for States

Every major component must define:

```text
Default
Hover
Focus
Active
Disabled
Loading
Empty
Error
Success
```

This requirement applies especially to:

* Buttons
* Inputs
* Tables
* Dropdowns
* Cards
* Navigation
* Tabs
* Modals
* Uploaders

---

# 71. File Upload UI

Documents are important in insurance workflows.

Upload components should clearly show:

```text
Upload area
File type
Maximum size
Upload progress
Success
Failure
Remove
Retry
```

Example:

```text
Drag & drop documents here

PDF, JPG, PNG
Maximum 10 MB

[Browse Files]
```

Never make the upload experience ambiguous.

---

# 72. Document Preview

Documents should support:

```text
File name
File type
Size
Uploaded by
Uploaded date
Preview
Download
Delete
```

Sensitive documents should not be unnecessarily exposed in previews or public URLs.

---

# 73. Dashboard Design

Dashboard should answer:

1. What needs my attention?
2. What is happening today?
3. What is overdue?
4. What is approaching?
5. What is performing well?

Recommended sections:

```text
KPI Summary
    ↓
Urgent Renewals
    ↓
Today's Follow-ups
    ↓
Lead / Policy Pipeline
    ↓
Recent Activity
```

Do not fill the dashboard with charts merely because charts look impressive.

---

# 74. Dashboard KPI Priority

Useful KPIs may include:

```text
Active Policies
Policies Expiring Soon
Renewals Due
Open Leads
Pending Follow-ups
Total Clients
Premium / Revenue
Claims
```

The exact KPI set should reflect actual business decisions.

---

# 75. Charts

Charts should answer a business question.

Good:

```text
Policy growth over time
Renewal conversion
Lead conversion
Premium distribution
```

Bad:

```text
Random pie chart
Random decorative graph
Chart with no actionable interpretation
```

Use the restrained data visualization palette defined in §6 (Data Visualization Palette). Prefer bar and line charts for business trends; reserve pie/donut charts for simple part-to-whole breakdowns with 5 or fewer segments.

---

# 76. Design Consistency Rules

The same concept must always look the same.

For example:

```text
Active → Success
Expired → Danger
Pending → Warning
```

This must remain consistent across:

* Dashboard
* Client page
* Policy page
* Renewal page
* Reports
* Tables
* Notifications

---

# 77. Component Naming

Components should be reusable and semantic.

Recommended:

```text
Button
Input
Select
DatePicker
Badge
Card
Table
DataTable
Modal
Drawer
Tabs
Tooltip
Dropdown
Pagination
EmptyState
ErrorState
LoadingState
FileUploader
```

Domain components:

```text
ClientCard
PolicyCard
RenewalBadge
PolicyStatus
ClientHeader
DocumentList
ActivityTimeline
```

---

# 78. Avoid Over-Abstraction

Do not create components for every tiny HTML wrapper.

Good:

```text
ClientStatusBadge
```

Bad:

```text
ClientPageSmallGrayContainer
```

Components should represent reusable behavior or meaningful UI concepts.

---

# 79. Design Token Architecture

Recommended structure:

```text
tokens/
├── colors
├── typography
├── spacing
├── radius
├── shadows
├── breakpoints
├── z-index
└── motion
```

Then expose them through the application's theme system.

Example:

```text
--color-primary
--color-surface
--color-text-primary
--color-border
--radius-md
--spacing-md
--shadow-sm
```

---

# 80. Tailwind Implementation

If Tailwind CSS is used, design tokens should be mapped into Tailwind rather than repeatedly writing arbitrary values.

Prefer:

```text
bg-primary
text-text-primary
border-border
rounded-md
```

over:

```text
bg-[#4F46E5]
text-[#0F172A]
border-[#E2E8F0]
rounded-[8px]
```

Arbitrary values should be exceptions, not the design system.

Minimum token mapping to define in `tailwind.config` / `globals.css`:

```css
:root {
  --surface-primary: #FFFFFF;
  --surface-secondary: #F1F5F9;
  --app-background: #F8FAFC;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --border-default: #E2E8F0;

  --primary-600: #4F46E5;
  --success-600: #16A34A;
  --warning-600: #D97706;
  --danger-600: #DC2626;
  --info-600: #2563EB;
}

.dark {
  --surface-primary: #1E293B;
  --surface-secondary: #334155;
  --app-background: #0F172A;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --border-default: #334155;
}
```

Every component reads from these CSS variables — never a raw hex or a raw Tailwind neutral shade — so a single toggle changes the whole app.

---

# 81. Dark Mode Implementation

Components must never assume:

```text
white background
black text
```

Instead use semantic tokens:

```text
surface-primary
surface-secondary
text-primary
text-secondary
border-default
```

The theme controls the actual values.

---

# 82. Design Review Checklist

Before considering a UI component complete, verify:

* [ ] Works in light mode
* [ ] Works in dark mode
* [ ] Responsive behavior defined
* [ ] Hover state defined
* [ ] Focus state defined
* [ ] Disabled state defined
* [ ] Loading state defined
* [ ] Error state defined
* [ ] Empty state defined where applicable
* [ ] Keyboard accessible
* [ ] Touch-friendly
* [ ] Color contrast acceptable
* [ ] No arbitrary colors
* [ ] No arbitrary spacing
* [ ] Typography follows system
* [ ] Border radius follows system
* [ ] Icons follow system
* [ ] Animation is purposeful

---

# 83. Design Anti-Patterns

The following should generally be avoided.

### Excessive gradients

Avoid gradients unless they have a specific product purpose.

### Excessive glassmorphism

Do not make the CRM look like a visual experiment.

### Excessive rounded corners

Avoid making every component `rounded-full`.

### Excessive shadows

Prefer borders and surface hierarchy.

### Too many colors

A CRM should have a restrained visual language.

### Tiny text

Do not sacrifice readability for information density.

### Excessive animations

Animations must improve understanding, not decoration.

### Giant dashboard cards

Do not consume half the screen with one KPI.

### Nested cards

Avoid cards inside cards inside cards.

### Inconsistent status colors

The same status must always have the same semantic meaning.

### Random spacing

All spacing should come from the spacing scale.

### Random font sizes

Typography should come from the defined type scale.

---

# 84. UX Performance Principles

Visual design must also support performance.

Avoid:

* Huge images
* Heavy animation libraries for simple transitions
* Rendering unnecessary dashboard charts
* Loading all table records at once
* Excessive DOM nesting
* Unnecessary modal rendering
* Large decorative assets

Prefer:

* Lazy loading
* Pagination
* Virtualized tables when necessary
* Skeleton loading
* Optimized images
* Server-side filtering for large datasets
* Debounced search
* Progressive loading

---

# 85. Design System Governance

Any new UI pattern should answer:

1. Does an existing component already solve this?
2. Can the existing component be extended?
3. Is this pattern likely to appear elsewhere?
4. Does it require a new design token?
5. Does it work in dark mode?
6. Does it work on mobile?
7. Does it have all necessary interaction states?

Do not create new UI patterns casually.

---

# 86. Definition of Done — UI

A UI feature is considered design-complete only when:

```text
Desktop
    ✓

Tablet
    ✓

Mobile
    ✓

Light mode
    ✓

Dark mode
    ✓

Loading
    ✓

Empty
    ✓

Error
    ✓

Success
    ✓

Hover
    ✓

Focus
    ✓

Disabled
    ✓

Accessibility
    ✓
```

---

# 87. Authentication Screens

Login, password reset, and 2FA are the first thing every user sees — they should feel like the same product as the dashboard, not a separate marketing page.

```text
Layout:        Centered card, max-width 400px, on app-background (not a
                large decorative hero image or gradient)
Logo:          Top of card, modest size
Fields:        Email, Password — standard input styling from §27
Primary action: Full-width primary button
Errors:        Inline, below the field that failed — never a generic
                banner for field-specific problems
Session:       "Remember me" as a simple checkbox, not a toggle switch
Footer:        Forgot password / contact administrator links, small text
```

Avoid split-screen marketing layouts, stock photography, or illustrations — this is internal business software, not a SaaS landing page.

---

# 88. Print & Export Styling

Generated PDFs (quotations, policy summaries, cost documents, reports) are an extension of the product and should feel visually related to the app, not like a separate tool produced them.

```text
Font:          Inter (or nearest available print-safe equivalent)
Primary color: Primary-700 for headings/accents (darker than screen UI —
                print has no dark-mode fallback and needs to work on
                plain white paper)
Body text:     Neutral-900 on white, 10-11pt
Tables:        Match app table alignment rules (§31) — numbers right-aligned,
                tabular-nums
Header/footer: Company name/logo top, page number + generated date bottom
Status labels: Reuse the same semantic words as the app ("Active", "Expired")
                — do not invent different wording for print
```

Never rely on color alone in exported documents either — status should still show as a text label, since printed documents are often photocopied or scanned in black and white.

---

# 89. Version History

```text
1.1 — Added data visualization palette, numeric accessibility
      contrast targets, Tailwind token mapping, toast/skeleton
      timing, authentication screen pattern, print/export
      styling, Indian currency formatting note.
1.0 — Initial design system.
```

---

# 90. Final Design Principle

The Insurance CRM should not try to impress users with visual complexity.

It should impress users through:

```text
Consistency
+
Speed
+
Clarity
+
Predictability
+
Information hierarchy
+
Excellent interaction design
```

The best CRM interface is the one where an experienced insurance agent can perform common tasks almost without thinking about the interface.

Every visual decision should answer:

> "Does this help the user understand information or complete the task faster?"

If the answer is no, remove it.
