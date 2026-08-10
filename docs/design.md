---
name: Executive Zenith
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#43474f'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#2e1a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b2d00'
  on-tertiary-container: '#d98b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 260px
  header-height: 72px
  container-max-width: 1440px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is engineered for high-stakes enterprise management within the UAE market, balancing global corporate standards with regional professional expectations. The personality is authoritative, precise, and transparent. 

The aesthetic follows a **Corporate Modern** direction with a heavy emphasis on **Minimalism**. It prioritizes high whitespace to reduce cognitive load during complex data entry and analysis. The interface utilizes a "Data-First" philosophy where the UI recedes to let critical information and status indicators take precedence. Visual clarity is achieved through rigorous alignment, intentional negative space, and a restrained use of color.

## Colors
The palette is rooted in a "Professional Deep Blue" to establish trust and stability. 

- **Primary (#003366):** Reserved for primary actions, active navigation states, and brand touchpoints.
- **Semantic Palette:** Success (Emerald), Warning (Amber), and Danger (Rose) are used exclusively for status indicators, data visualization, and critical feedback loops.
- **Neutrals:** A range of cool grays is used for borders, secondary text, and icons to maintain a calm environment.
- **Surface Strategy:** The background uses a subtle off-white (#F9FAFB) to differentiate the canvas from the pure white (#FFFFFF) surface containers, providing a clear "layered" effect without needing heavy borders.

## Typography
Inter is chosen for its exceptional legibility in data-dense environments. 

- **Hierarchy:** Use `display-lg` and `headline-lg` sparingly for dashboard overviews. 
- **Body Text:** `body-md` (14px) is the standard for data tables and form inputs to maximize information density while remaining readable.
- **Labels:** `label-md` utilizes uppercase styling and increased letter spacing for section headers and table column headers.
- **Regional Note:** When localized for Arabic, ensure the line height is increased by 20% to accommodate the script's ascenders and descenders.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. 

- **Structural Pillars:** A permanent left sidebar (260px) houses the primary navigation. A top header (72px) provides global search and profile actions. 
- **Grid:** The main content area uses a 12-column fluid grid with 24px gutters.
- **Spacing Rhythm:** An 8px base unit drives all dimensions. 
- **Breakpoints:** 
  - **Desktop (1280px+):** Full 260px sidebar visible.
  - **Tablet (768px - 1279px):** Sidebar collapses to icons only (72px width).
  - **Mobile (<768px):** Sidebar becomes a hidden drawer; page margins reduce to 16px.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**.

- **Level 0 (Background):** #F9FAFB – The lowest layer.
- **Level 1 (Surface):** #FFFFFF – Used for cards and table containers. These feature a very soft, diffused shadow: `0px 1px 3px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.02)`.
- **Level 2 (Overlay/Modals):** Pure white with a more pronounced shadow to indicate focus and interaction: `0px 10px 15px rgba(0,0,0,0.1)`.
- **Borders:** A 1px solid border (#E5E7EB) is used on Level 1 surfaces to maintain definition against the light background.

## Shapes
The shape language is "Rounded" to soften the clinical nature of enterprise software.

- **Standard Elements:** Buttons, input fields, and small cards use a **0.5rem (8px)** radius.
- **Large Containers:** Main content cards and modals use a **1rem (16px)** radius to create a distinct visual hierarchy.
- **Badges:** Status badges and chips use a fully rounded (pill) shape to distinguish them from actionable buttons.

## Components
- **Data Tables:** Use a zebra-striping effect on hover only. Row height should be 52px for standard and 44px for compact views. Column headers must be `label-md` with neutral-500 color.
- **Status Badges:** Use a light background (10% opacity of the semantic color) with high-contrast text for maximum readability. 
  - *Active:* Light Green BG / Dark Green Text.
  - *Overdue:* Light Red BG / Dark Red Text.
- **Buttons:**
  - *Primary:* Solid #003366 with white text.
  - *Secondary:* Ghost style with #003366 border and text.
  - *Tertiary:* Flat text for low-priority actions.
- **Input Fields:** 1px border (#D1D5DB) which shifts to Primary Blue on focus. Labels should always be visible above the field in `body-sm` weight.
- **Cards:** White surface, 1px border, Level 1 shadow. Padding should be a consistent 24px (`stack-lg`).
- **Sidebar Items:** Use 12px horizontal padding. The active state should feature a 4px vertical primary blue bar on the far left edge of the menu item.