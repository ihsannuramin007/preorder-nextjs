---
version: alpha
name: Saweria Mono Play
description: A bright, playful fundraising system with a handcrafted mono-and-display typographic mix.
colors:
  primary: "#1a202c"
  secondary: "#faae2b"
  tertiary: "#f2f7f5"
  neutral: "#ffffff"
  surface: "#f2f7f5"
  on-surface: "#1a202c"
  border: "#000000"
  accent: "#8dd7e8"
  error: "#d64545"
  muted: "#6b7280"
typography:
  headline-display:
    fontFamily: Comfortaa
    fontSize: 48px
    fontWeight: 300
    lineHeight: 57.6px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Comfortaa
    fontSize: 36px
    fontWeight: 300
    lineHeight: 43px
    letterSpacing: 0px
  headline-md:
    fontFamily: Comfortaa
    fontSize: 28px
    fontWeight: 300
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: IBM Plex Mono
    fontSize: 21px
    fontWeight: 300
    lineHeight: 25px
    letterSpacing: 0px
  body-lg:
    fontFamily: IBM Plex Mono
    fontSize: 18px
    fontWeight: 300
    lineHeight: 27px
    letterSpacing: 0px
  body-md:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: 300
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 300
    lineHeight: 21px
    letterSpacing: 0px
  label-lg:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  label-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0px
  label-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 20px
  lg: 32px
  xl: 76px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "12px 12px 16px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
---

# Saweria Mono Play

## Overview

Saweria feels friendly, lighthearted, and highly approachable, with a strong DIY creator-energy rather than a corporate fintech tone. The page uses a large amount of white space, simple boxes, and playful accents to keep the interface low-pressure and easy to scan. It is aimed at creators and fans who want a quick, understandable way to set up support and payments.

## Colors

- **Primary (#1A202C):** A deep ink used for body text, outlines, and the strongest UI contrast. It anchors the system and gives the playful palette structure.
- **Secondary (#FAAE2B):** A warm golden orange that acts as the main call-to-action color and top-banner highlight. It feels energetic, promotional, and optimistic.
- **Tertiary (#F2F7F5):** A very light mint-gray surface used for cards and content panels. It softens the interface while keeping the page airy.
- **Neutral (#FFFFFF):** The base page background and the cleanest negative space. It helps the accent colors and dark type remain prominent.
- **Surface (#F2F7F5):** The main card surface color, matching the pale panel treatment seen in the screenshot. It separates content from the white page without feeling heavy.
- **On-surface (#1A202C):** The default text color inside panels and cards. It preserves readability on the light mint surface.
- **Border (#000000):** A crisp black used for outlines, card borders, and button edges. Combined with shadows, it gives the UI a cutout, sticker-like look.
- **Accent (#8DD7E8):** A soft cyan accent suitable for secondary emphasis, such as login-related controls or informational highlights. It echoes the gentle playful tone.
- **Error (#D64545):** A restrained red reserved for destructive states or validation feedback. It should be used sparingly to avoid competing with the cheerful accent palette.
- **Muted (#6B7280):** A supporting neutral for less prominent metadata, helper text, and secondary copy.

## Typography

The system mixes two distinct families: Comfortaa for display moments and IBM Plex Mono for interface text. Comfortaa brings a rounded, friendly personality to prominent headlines such as the brand title and hero message, while IBM Plex Mono gives instructions, lists, and buttons a practical, coded, creator-tool feel.

Headlines are light-weight and oversized, with the largest display level at 48px and descending through 36px and 28px. Body text stays compact and readable at 16px with a 24px line height, while smaller labels and utility copy use the same mono family for consistency. The screenshot shows no aggressive uppercase treatment or wide tracking; the tone is casual and direct, so letter spacing should remain neutral.

## Layout & Spacing

The layout is centered and vertically generous, with content stacked in a single main column and large gaps between hero, buttons, and cards. The page relies on expansive whitespace rather than dense grids, making the hierarchy easy to follow even with many payment options.

Use the spacing scale as a small, steady rhythm: 8px for tight internal gaps, 16px for standard padding, 20px for modest separations, 32px for section spacing, and 76px for hero-level breathing room. Cards should feel roomy but not oversized, with padding close to the observed 12px top/side and 16px bottom treatment. Sections should remain narrow and centered rather than stretched edge-to-edge.

## Elevation & Depth

Depth is created mostly through hard offset shadows and strong borders, not through blur-heavy elevation. The cards and buttons look like physical cutouts: black shadows offset down and right, paired with crisp outlines that make the interface feel tactile and handmade.

Keep surfaces flat and simple; avoid layered glass effects, gradients, or soft shadow stacks. The contrast between white page, pale cards, black strokes, and warm accent blocks is the primary hierarchy tool. The shadow style should remain deliberate and graphic rather than subtle.

## Shapes

The shape language is slightly rounded but still boxy and utilitarian. Small radii like 4px to 6px appear on buttons and cards, which keeps the system approachable without becoming pill-shaped or overly friendly.

Use rounded corners to soften the interface just enough for a casual creator product. Avoid large radii on primary surfaces; the form should stay architectural and compact, with the occasional full-radius only for badges or chips if needed.

## Components

Buttons are compact, high-contrast, and minimally decorated. `button-primary` should use the dark ink background with warm yellow text, matching the prominent action style in the screenshot. `button-secondary` should remain transparent with a dark border and dark text, used for lower-emphasis actions like login or secondary navigation. `button-link` is plain text with no container, underline only, and no shadow. All buttons should sit at about 40px tall with 8px vertical and 16px horizontal padding, and they should preserve the crisp border/shadow treatment rather than adding motion-heavy styling.

Cards are a core visual container. The `card` component should use the pale surface fill, black border, and offset shadow to feel like a raised note or panel. Keep card typography in `on-surface` and use generous internal padding so lists and paragraphs breathe. Cards should not become glossy or heavily elevated; the current look is intentionally flat with a paper-like feel.

Inputs should follow the same button logic: simple, bordered, and easy to scan. Use the `input` token for fields with light backgrounds, dark text, compact padding, and a 40px height. Focus states should be clear through border or outline contrast, not through elaborate shadows.

Lists, payment option groups, and small informational badges should remain typographically simple and aligned to the mono system. If chips or labels are added, keep them small, outlined, and rectangular rather than fully rounded. Any iconography should feel playful but restrained, supporting the handcrafted personality without overpowering the layout.

## Do's and Don'ts

- Do keep the page centered with lots of whitespace around the hero and content cards.
- Do use Comfortaa for big expressive headings and IBM Plex Mono for buttons, body copy, and lists.
- Do preserve the hard shadow + black border combination for cards and buttons.
- Do keep CTA buttons compact and clearly differentiated by filled versus outlined treatment.
- Don't replace the mono text with a generic sans-serif across the interface.
- Don't introduce soft, blurry, modern-neumorphic shadows; the system relies on crisp offset depth.
- Don't make cards overly rounded, tall, or crowded with dense layout patterns.
- Don't overuse extra colors; let the warm yellow and dark ink remain the main hierarchy drivers.
