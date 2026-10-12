---
name: Atelier Amber & Noir
colors:
  surface: '#131312'
  surface-dim: '#131312'
  surface-bright: '#3a3938'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1c1c1a'
  surface-container: '#20201e'
  surface-container-high: '#2a2a29'
  surface-container-highest: '#353533'
  on-surface: '#e5e2df'
  on-surface-variant: '#d1c5b0'
  inverse-surface: '#e5e2df'
  inverse-on-surface: '#31302f'
  outline: '#9a8f7d'
  outline-variant: '#4e4636'
  surface-tint: '#eec055'
  primary: '#f6c75b'
  on-primary: '#3f2e00'
  primary-container: '#d8ac43'
  on-primary-container: '#584100'
  inverse-primary: '#785a00'
  secondary: '#e3c37a'
  on-secondary: '#3e2e00'
  secondary-container: '#594404'
  on-secondary-container: '#d0b26a'
  tertiary: '#eec97d'
  on-tertiary: '#402d00'
  tertiary-container: '#d0ae65'
  on-tertiary-container: '#594100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9c'
  primary-fixed-dim: '#eec055'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#ffdf98'
  secondary-fixed-dim: '#e3c37a'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#594404'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#e6c277'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4301'
  background: '#131312'
  on-background: '#e5e2df'
  surface-variant: '#353533'
  surface-charcoal: '#181715'
  surface-raised: '#22201D'
  amber-glow: '#E6BE5A'
  gold-border: '#3D3524'
  cash-positive: '#62B079'
  stock-warning: '#E86A58'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  numeric-metric:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-compact: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system embodies haute perfumerie, quiet luxury, and artisanal precision. Tailored for mobile commerce and operational management (inventory tracking, financial metrics, artisanal batch logging), the interface balances sensory opulence with high-density utility. 

The aesthetic is rooted in **Minimalist Luxury with Tactile Matte Tones**. It features pitch-black and deep charcoal canvas foundations punctuated by radiant amber golds, satin-finished translucent cards, and whisper-thin metallic framing. The emotional tone evokes exclusivity, craftsmanship, and absolute discipline—reminiscent of a bespoke Parisian perfume atelier paired with a high-end financial vault.

## Colors

The palette operates in dark mode by default to highlight the golden liquor of perfumes and decants while providing an authentic luxury atmosphere.

- **Primary (`#D8AC43`)**: Rich Imperial Gold, used exclusively for primary CTAs, active highlights, key values, and brand accents.
- **Secondary (`#F4D388`)**: Soft Champagne Gold, employed for sub-headers, delicate active states, and decorative badges.
- **Tertiary (`#8A6D2B`)**: Deep Antique Bronze, reserved for subtle progress indicators, card borders, and subdued icon fills.
- **Neutral (`#0B0B0A`)**: Ultra-deep Obsidian Black, serving as the base canvas to maximize battery efficiency on OLED screens and minimize eye fatigue during inventory audits.
- **Surface Tones (`surface-charcoal: #181715`, `surface-raised: #22201D`)**: Warm, low-saturation charcoals that prevent harsh starkness and structure the information hierarchy.
- **Semantic Accents**: Deep, desaturated emerald green (`cash-positive`) and aged cinnabar (`stock-warning`) maintain the understated palette while delivering clear telemetry for financials and stock counts.

## Typography

The type system creates tension between classic high-fashion editorial aesthetics and hyper-legible modern data visualization:

- **Editorial Headings (`Bodoni Moda`)**: High-contrast serifs reference vintage perfume bottle typography, lineage, and perfumery heritage. Reserved for collection titles, product classifications, and screen focal points.
- **Functional Body & Analytics (`Manrope`)**: A clean, balanced geometric sans-serif that ensures rapid readability for millilitres (ml), batch codes, inventory counters, unit economics, and operational flows.
- **Labels & Microcopy**: Formatted in all-caps with generous tracking (`0.08em` to `0.1em`) to replicate engraved metal bottle plates and vintage cosmetic packaging.

## Layout & Spacing

A strictly regulated, 4-column fluid mobile layout anchored by an 8pt base spatial unit.

- **Horizontal Margins**: A standard `1.25rem` (20px) outer edge boundary prevents accidental edge taps while establishing an editorial border.
- **Gutters**: `1rem` (16px) separation between 2-column product tiles (decants, artisanal soaps, solid bars) and financial KPI summary blocks.
- **Density Control**: Operational views (Stock Management, Daily Revenue, Decant Volume Tracking) switch dynamically to compact spacing (`space-xs` and `space-sm`) to increase information density, while sensory product displays embrace `space-lg` and `space-xl` to let luxury photography breathe.

## Elevation & Depth

Visual hierarchy abandons loud, diffuse drop shadows in favor of **low-contrast metallic outlines and layered tonal containment**.

1. **Base Surface**: Absolute black (`#0B0B0A`), establishing zero elevation.
2. **Surface Level 1 (Cards, Modules, Input Groups)**: Deep charcoal (`#181715`) framed with a razor-thin 1px solid border in muted brass (`#3D3524` at 60% opacity).
3. **Surface Level 2 (Modals, Overlays, Floating Action Bars)**: Raised obsidian (`#22201D`) accompanied by a targeted ambient gold-tinted shadow: `0 12px 32px -4px rgba(216, 172, 67, 0.08), 0 4px 12px rgba(0, 0, 0, 0.6)`.
4. **Active/Highlight Elevation**: A subtle inner amber glow (`box-shadow: inset 0 0 0 1px #D8AC43`) applied to selected decant vials, active filter chips, or alerted inventory thresholds.

## Shapes

The design system employs a **Soft (`1`)** shape language (0.25rem base radius; 0.5rem on larger surfaces). 

Sharp geometric corners tempered by slight beveling echo artisanal glass decant flacons, hand-cut soap blocks, and structural label plates. Perfectly circular shapes (`rounded-full`) are reserved exclusively for liquid volume badges (e.g., "5ml", "10ml") and avatar initials to contrast against the architectural rectangular grid.

## Components

### Buttons
- **Primary CTA**: Solid gold fill (`#D8AC43`), pitch-black bold typography (`#0B0B0A`), 44px min touch target, uppercase label styling. Hover/pressed state shifts to `#F4D388` with a subtle amber glow.
- **Secondary / Action**: Deep charcoal background (`#181715`) with a 1px border in `#D8AC43` and text in `#F4D388`.
- **Tertiary / Utility**: Ghost button with text in `#D8AC43`, underlined on press, with no outer boundary.

### Cards & Metrics
- **Product Card**: Background in `#181715`, fine border in `#3D3524`. Features high-contrast product imagery against dark backdrops, serif titles (`Bodoni Moda`), and a dedicated badge for decant volume or product craft type (e.g., "Decant", "Vela Aromática", "Sabonete Frio").
- **Financial & Stock Card**: Compact card format containing numeric KPI counters in bold sans-serif (`Manrope`), accompanied by small micro-trend indicators in soft green (`#62B079`) or amber red (`#E86A58`).

### Input Fields & Controls
- **Text Inputs**: Flat charcoal base (`#181715`), border `#3D3524`. When focused, transitions to a crisp `#D8AC43` border with zero blur. Placeholder text rests in low-opacity champagne.
- **Checkboxes & Radios**: Custom square components with 2px borders in `#D8AC43`. Checked states display a solid gold fill with an obsidian checkmark icon.

### Chips & Filter Tags
- Outlined tags featuring tracked uppercase labels. Active chips switch to gold border with an ambient inner glow, giving instant clarity during fragrance family filtering (e.g., "AMADEIRADO", "ORIENTAL", "GOURMAND", "CHYPRE").

### Decant Volume Selector
- Segmented control module grouping distinct bottle quantities (`2ml`, `5ml`, `10ml`, `Frasco Cheio`). Each pill utilizes discrete hairline borders, highlighting the chosen fraction in solid gold.