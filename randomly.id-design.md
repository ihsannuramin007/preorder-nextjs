---
version: alpha
name: Randomly ID
description: A playful, high-contrast quiz and decision-making interface with bold yellow, punchy pink, and crisp rounded cards.
colors:
  primary: "#FFD400"
  primary-strong: "#FF3B6B"
  secondary: "#111111"
  tertiary: "#FFFFFF"
  neutral: "#9A9A9A"
  surface: "#FFFFFF"
  surface-muted: "#F7F7F7"
  border: "#E5E7EB"
  border-strong: "#0D0D0D"
  on-surface: "#111111"
  on-primary: "#111111"
  on-secondary: "#FFFFFF"
  error: "#FF3B6B"
typography:
  headline-display:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "29px"
    letterSpacing: "0px"
  headline-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "0px"
  label-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "18px"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0px"
  caption:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0px"
  overline:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "14px"
    letterSpacing: "0.04em"
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 2px
  sm: 6px
  md: 14px
  lg: 20px
  xl: 24px
  xxl: 32px
  page: 16px
  gutter: 12px
components:
  button-primary:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "14px 10px"
    width: "215px"
    height: "72px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "14px 10px"
    width: "215px"
    height: "72px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.neutral}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
  chip-selected:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
---

# Randomly ID

## Overview
Randomly ID feels playful, upbeat, and slightly cheeky, aimed at users who want quick decisions, fun prompts, and low-friction interaction. The visual tone is bright and optimistic, with a strong focus on clarity and immediate action rather than density or complexity. The layout is compact in content but airy in whitespace, giving the page a light, conversational personality.

## Colors
- **Primary (#FFD400):** A vivid sunflower yellow used for the main brand moments, active emphasis, and warm surface blocks. It gives the interface its cheerful, energetic core.
- **Primary Strong (#FF3B6B):** A punchy pink-red accent used for attention-grabbing secondary highlights and the most playful cards. It adds contrast and a youthful, snackable feel.
- **Secondary (#111111):** A near-black ink used for headings, button surfaces, and high-contrast framing. It provides structure against the bright palette.
- **Tertiary (#FFFFFF):** Clean white used for page background, cards, and neutral surfaces. It keeps the interface open and readable.
- **Neutral (#9A9A9A):** A muted gray used for helper text, links, and less important metadata. It supports hierarchy without competing with the accents.
- **Border (#E5E7EB):** A soft divider tone used for chips, cards, and subtle grid lines. It preserves a light, casual presentation.
- **Border Strong (#0D0D0D):** A hard black border used to create the brand’s cartoon-like, tactile edge language on buttons and cards.
- **Surface Muted (#F7F7F7):** A faint off-white for gentle separation when a neutral layer is needed without adding visual weight.

## Typography
The system uses Plus Jakarta Sans throughout, which gives the product a modern, friendly, and highly legible voice. Headlines are bold and compact, with `headline-display` and `headline-lg` carrying the strongest weight for promotional banner text and key question prompts. `headline-md` and `headline-sm` support section labels and smaller hierarchy steps without feeling formal.

Body text stays clean and understated in `body-lg`, `body-md`, and `body-sm`, keeping the interface easy to scan on mobile. Labels use semibold weights in `label-lg`, `label-md`, and `label-sm` to make buttons and chips feel crisp and tappable. Small utility text may use `caption` or `overline`; uppercase usage is minimal, but where present it should rely on increased letter spacing rather than decorative styling.

## Layout
The page is centered in a narrow, mobile-like column with generous surrounding whitespace, which makes the experience feel focused despite the playful content. Spacing follows a small, rhythmic scale built around 2px, 6px, 14px, 20px, and 24px increments, with slightly larger jumps for major content breaks. Cards, buttons, and chip groups use compact internal padding so the interface stays dense enough for quick decision-making without feeling crowded.

Section separation is often created with thin rules, margins, and grouped blocks rather than large empty panels. Primary actions are full-width or near-full-width in their visual weight, while smaller choice chips use tight gutters and aligned rows to preserve scanability. The overall structure favors stacked modules over complex multi-column layouts.

## Elevation & Depth
Depth is expressed with contrast and outline rather than soft shadow layering. The strongest signature treatment is the black offset shadow used on primary buttons and some highlighted cards, which creates a tactile, sticker-like effect. Surfaces are otherwise flat, clean, and minimally layered, allowing yellow and pink fills to do the visual work.

Borders are important for hierarchy: dark outlines separate hero actions, while light gray borders define chips, cards, and content groups. This gives the UI a hand-drawn, editorial feel without heavy realism. Use shadow sparingly and only when you want a deliberate “lifted” or toy-like emphasis.

## Shapes
The shape language is rounded and friendly, with pills dominating interactive controls and soft rectangles used for content cards. Buttons and chips lean heavily on `rounded.full`, while cards use the smaller `rounded.sm` treatment to stay structured. The result is approachable and playful, but still disciplined enough for fast scanning.

Avoid sharp, boxy corners on interactive elements unless they are meant to read as system separators or utility dividers. Large radii are part of the brand’s personality and should be preserved for the main actions.

## Components
Buttons are the clearest brand expression. `button-primary` should use the strong pink fill with white text, a full pill radius, a 2px dark border, and the offset black shadow when emphasis is needed. `button-secondary` should be white with dark text and a light border, keeping the same pill shape and generous height so it reads as a peer option. `button-link` is minimal, gray, and underlined for secondary navigation or disclosure actions.

Cards should be simple white surfaces with subtle borders and modest internal padding. Use `card` for option blocks or content containers that need structure without competing with the accent colors. When a card is meant to feel especially playful or actionable, allow a saturated fill like yellow or pink, but keep the border strong and the typography compact.

Inputs and pill-shaped choice controls should remain low-profile and highly legible. `input` uses a full radius and clear padding so it feels easy to tap, while chips should be compact, outlined, and horizontally aligned. The selected chip style should invert into the dark surface with bright text to indicate active state clearly.

For lists and grid choices, prefer simple icons above short labels, with selected states expressed through dark backgrounds and vivid foreground text. Avoid complex nesting, heavy gradients, or decorative chrome; the system works best when each component is immediately understandable and visually direct.

## Do's and Don'ts
- Do keep primary actions bold, pill-shaped, and high contrast.
- Do use yellow and pink as the main emotional accents, with black providing structure.
- Do preserve generous whitespace around the centered content column.
- Do rely on borders and offset shadows for depth instead of soft, realistic elevation.
- Don't introduce sharp-cornered buttons or highly angular cards.
- Don't replace the simple sans-serif hierarchy with serif or decorative display fonts.
- Don't overload screens with too many accent colors or competing highlights.
- Don't use heavy gradients, glassmorphism, or complex shadows that dilute the crisp cartoon-like feel.