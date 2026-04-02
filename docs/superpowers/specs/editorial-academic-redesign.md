# Editorial Academic Redesign — Design Specification

**Project:** Durham AI Safety Initiative Website Redesign  
**Direction:** Editorial Academic  
**Date:** 2026-04-02  
**Status:** Approved for Implementation

---

## Executive Summary

This specification defines a comprehensive redesign of the DAISI website to eliminate "AI-generated" aesthetic markers and create a distinctive, credible identity that appeals to both students and academics. The design direction—**Editorial Academic**—combines the sophistication of editorial design with academic credibility signals.

### Core Objectives

1. **Eliminate generic AI aesthetic** — Replace IBM Plex Sans/Inter, gradient backgrounds, glass-morphism cards
2. **Balance dual audience** — Appeal to students (modern, approachable) and academics (credible, authoritative)
3. **Strategic Durham purple usage** — Present but not dominant; accent rather than background color
4. **Major overhaul scope** — Rethink typography, color, layout, and components from the ground up
5. **Distinctive yet professional tone** — Between bold/unconventional and safe/boring

---

## 1. Typography System

Typography is the foundation of the Editorial Academic aesthetic. Moving from generic sans-serif pairings to a sophisticated serif/sans combination.

### Font Stack

#### Display & Headings: **Crimson Text**
- **Role:** All h1, h2, h3 headings
- **Rationale:** Classic serif with academic pedigree; signals intellectual credibility without feeling corporate or stuffy
- **Weights:** 400 (regular), 600 (semibold), 700 (bold)
- **Includes:** Italic for emphasis
- **Source:** Google Fonts
- **Load:** `family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400`

#### Body Text: **Work Sans**
- **Role:** All paragraphs, labels, UI text
- **Rationale:** Clean geometric sans-serif; excellent readability; modern but not overused like Inter
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold)
- **Source:** Google Fonts
- **Load:** `family=Work+Sans:wght@300;400;500;600`

#### Accents & Labels: **Space Mono**
- **Role:** Section numbers, dates, tags, metadata, code-like elements
- **Rationale:** Monospace adds visual interest and technical credibility (appropriate for AI Safety context)
- **Weights:** 400 (regular), 700 (bold)
- **Usage:** Use sparingly for maximum impact
- **Source:** Google Fonts
- **Load:** `family=Space+Mono:wght@400;700`

### Type Scale

| Element | Font | Weight | Size (px/rem) | Line Height | Letter Spacing |
|---------|------|--------|---------------|-------------|----------------|
| **Hero Headline** | Crimson Text | 700 | 56px / 3.5rem | 1.1 | -0.02em |
| **Page Title (H1)** | Crimson Text | 700 | 40px / 2.5rem | 1.15 | -0.02em |
| **Section Heading (H2)** | Crimson Text | 600 | 28px / 1.75rem | 1.2 | -0.01em |
| **Card/Component Title (H3)** | Crimson Text | 600 | 20px / 1.25rem | 1.3 | normal |
| **Body Large** | Work Sans | 400 | 18px / 1.125rem | 1.7 | normal |
| **Body Regular** | Work Sans | 400 | 16px / 1rem | 1.6 | normal |
| **Body Small** | Work Sans | 400 | 14px / 0.875rem | 1.5 | normal |
| **Label/Meta** | Space Mono | 400 | 13px / 0.8125rem | 1.4 | 0.05em |
| **Section Number** | Space Mono | 400 | 14px / 0.875rem | 1 | 0.1em |

### Implementation Notes

- **CSS Variables:**
  ```css
  --font-display: "Crimson Text", serif;
  --font-body: "Work Sans", sans-serif;
  --font-mono: "Space Mono", monospace;
  ```

- **Google Fonts URL:**
  ```
  https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap
  ```

- **Emphasis in body text:** Use `<em>` (italic Work Sans) for light emphasis, `<strong>` (600 weight Work Sans) for strong emphasis

---

## 2. Color System

Move from gradient-heavy purple everywhere to a refined monochrome palette with Durham purple as a strategic accent.

### Primary Palette

| Color Name | Hex | Usage |
|------------|-----|-------|
| **Pure White** | `#FFFFFF` | Main backgrounds, cards (light mode) |
| **Off-White** | `#F8FAFC` | Alternate section backgrounds (light mode) |
| **Charcoal** | `#1A1A1A` | Primary text (light mode), backgrounds (dark mode) |
| **Slate Grey** | `#475569` | Body text, secondary elements |
| **Light Slate** | `#94A3B8` | Muted text, labels, metadata |
| **Border Grey (Light)** | `#E2E8F0` | Card borders, dividers (light mode) |
| **Border Grey (Dark)** | `#2A2A2A` | Card borders, dividers (dark mode) |
| **Durham Purple** ⭐ | `#682860` | CTA buttons, links, accent borders |

### Dark Mode Palette

| Color Name | Light Value | Dark Value |
|------------|-------------|------------|
| Background | `#FFFFFF` | `#0A0A0A` |
| Surface (Cards) | `#FFFFFF` | `#1A1A1A` |
| Surface Muted | `#F8FAFC` | `#1C1C28` |
| Heading Text | `#1A1A1A` | `#E8E8E8` |
| Body Text | `#475569` | `#A0A0B8` |
| Muted Text | `#94A3B8` | `#52526A` |
| Durham Purple | `#682860` | `#8B3D7D` (slightly lighter for contrast) |

### Durham Purple Usage Strategy

#### ✅ DO Use Durham Purple For:
- Primary CTA buttons ("Get Involved", "Sign Up")
- Navigation active/hover states
- Text links and link hover states
- Key section accent borders (3-4px left border on select cards/sections)
- Header branding elements (logo background, active nav indicator)
- Icon highlights in limited contexts
- Underlines on important links

#### ❌ DON'T Use Durham Purple For:
- Full page backgrounds
- Large gradient overlays
- Card backgrounds (except accent borders)
- Body text
- Every section header
- Default button states (use outlined style instead)

### Section Background Alternation

Alternate between white and off-white backgrounds to create rhythm without heaviness:

```
Hero Section → Image-based (dark gradient overlay)
Section 1 (Events) → White (#FFFFFF)
Section 2 (About) → Off-white (#F8FAFC)
Section 3 (Research) → White (#FFFFFF)
Section 4 (Get Involved) → Off-white (#F8FAFC)
Footer → Charcoal (#1A1A1A)
```

### CSS Variables

```css
/* Light mode (default) */
:root {
  --color-surface: #ffffff;
  --color-surface-muted: #f8fafc;
  --color-body-text: #475569;
  --color-heading-text: #1a1a1a;
  --color-muted-text: #94a3b8;
  --color-border: #e2e8f0;
  --color-durham-purple: #682860;
}

/* Dark mode */
.dark {
  --color-surface: #1a1a1a;
  --color-surface-muted: #1c1c28;
  --color-body-text: #a0a0b8;
  --color-heading-text: #e8e8e8;
  --color-muted-text: #52526a;
  --color-border: #2a2a2a;
  --color-durham-purple: #8b3d7d;
}
```

---

## 3. Layout & Structure

Move from centered, symmetric layouts to intentional asymmetry and editorial spacing.

### Core Layout Principles

#### 1. Asymmetric Content Blocks
- **Instead of:** Always centering content in containers
- **Do:** Use intentional off-center positioning (e.g., content in left 65%, right 35% empty or supporting)
- **Creates:** Visual tension, editorial sophistication, prevents "template" feel

#### 2. Section Numbering System
- **Format:** `01 — ABOUT`, `02 — RESEARCH`, `03 — PROGRAMMES`, etc.
- **Font:** Space Mono, 14px (0.875rem), letter-spacing 0.1em
- **Color:** Light Slate (#94A3B8)
- **Position:** Above section headings, small caps or uppercase
- **Rationale:** Mimics academic paper structure, provides visual wayfinding

#### 3. Generous Whitespace
- **Section padding (desktop):** 120px top/bottom (current: ~80px)
- **Section padding (mobile):** 64px top/bottom
- **Heading margins:**
  - H1: 0 0 48px 0
  - H2: 48px 0 32px 0
  - H3: 32px 0 16px 0
- **Paragraph spacing:** 24px between paragraphs
- **Component gaps:** 64px between major components (cards, images, etc.)
- **Container max-width:** 1200px (site-wide)
- **Container padding:** 0 2.5rem (desktop), 0 1.5rem (mobile)

#### 4. Grid System
- **Base:** 12-column CSS Grid
- **Gap:** 32px (desktop), 24px (tablet), 16px (mobile)
- **Common layouts:**
  - 8-column content / 4-column sidebar (2:1 asymmetric)
  - 5-column / 7-column split
  - 6-column / 6-column (symmetric for specific content)
  - Full 12-column for hero, footer

### Hero Section Redesign

**Current issues:**
- Uniform gradient overlay obscures hero image
- Centered text feels generic
- Italic styling on headline is distracting

**New approach:**
- **Gradient:** Directional left-to-right (dark → transparent)
  ```css
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.4) 70%,
    transparent 100%
  );
  ```
- **Content positioning:** Left-aligned at 5% from left edge (not centered)
- **Text hierarchy:**
  - Label: "DURHAM AI SAFETY INITIATIVE" (Space Mono, uppercase, light slate)
  - Headline: "Reducing catastrophic risks from advanced AI" (Crimson Text 700, 56px, no italic)
  - Subheadline: "Students and academics at Durham University working on the world's most important problem." (Work Sans 400, 20px)
- **CTAs:** Two buttons side-by-side
  - Primary: Solid Durham purple, "Get Involved"
  - Secondary: Outlined white, "Learn More"
- **Cathedral image:** Right side remains visible through gradient transparency

### Section Structure Template

```html
<section class="section-[white|muted]">
  <div class="site-container">
    <p class="section-number">01 — SECTION NAME</p>
    <h2 class="section-heading">Section Title</h2>
    <p class="section-intro">Introductory paragraph (Body Large)</p>
    
    <!-- Content grid (asymmetric where appropriate) -->
    <div class="content-grid">
      <!-- Cards, images, text blocks -->
    </div>
  </div>
</section>
```

### Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

**Mobile adaptations:**
- Asymmetric layouts collapse to single column
- Section padding reduces to 64px
- Typography scales down ~15% (maintain readability)
- Hero text remains left-aligned (not centered)

---

## 4. Components & Cards

Replace glass-morphism cards with solid, editorial-style components.

### Card Design Specifications

#### Base Card Style

```css
.card {
  background: #ffffff; /* var(--color-surface) */
  border: 1px solid #e2e8f0; /* var(--color-border) */
  border-radius: 4px; /* Sharp, intentional corners */
  padding: 24px; /* 1.5rem consistent */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Subtle depth */
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Lift on hover */
  /* No transform - keep grounded */
}

.dark .card {
  background: #1a1a1a;
  border-color: #2a2a2a;
}
```

### Component Variants

#### 1. Research Paper Card

**Structure:**
- Thumbnail (100x100px, 4px radius) on left
- Content on right
- Metadata (date, venue) in Space Mono above title
- Title in Crimson Text 600, 20px
- Authors below (bold team members)
- Tags in subtle grey boxes
- Link in Durham purple with underline

**Layout:**
```
┌─────────────────────────────────────┐
│ [Thumb] JULY 2025 · NEURIPS         │
│ [100px] Paper Title Here (Serif)    │
│         Author Name, Co-author       │
│         [tag1] [tag2]                │
│         Read paper →                 │
└─────────────────────────────────────┘
```

#### 2. Programme/Event Card

**Structure:**
- **Left accent border:** 4px solid Durham purple (instead of full card background)
- Icon in Durham purple box (48x48px, 4px radius)
- Title in Crimson Text 600
- Metadata (time, location) in Space Mono below title
- Description in Work Sans
- Link at bottom

**Layout:**
```
┌─────────────────────────────────────┐
│ █ [Icon] Weekly Reading Group       │
│ █        THURSDAYS · 18:00          │
│ █                                   │
│ █ Description text here...          │
│ █ Learn more →                      │
└─────────────────────────────────────┘
```

#### 3. Team Member Card

**Structure:**
- Photo (1:1 aspect ratio, 4px radius, subtle border)
- Name in Crimson Text 600, 18px
- Role in Durham purple, Work Sans 600, 14px
- Additional info (department, year) in Slate Grey

**Max-width:** 280px (prevents oversized cards)

#### 4. Get Involved / CTA Card

**Structure:**
- Icon in Durham purple background (as above)
- Title in Crimson Text
- Description
- Solid Durham purple CTA button

### Button Styles

#### Primary CTA
```css
.btn-primary {
  background: #682860; /* var(--color-durham-purple) */
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #7a2d80; /* Slightly lighter */
}
```

#### Secondary CTA (Outlined)
```css
.btn-secondary {
  background: transparent;
  color: #682860;
  padding: 12px 28px; /* 2px less due to border */
  border: 2px solid #682860;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #682860;
  color: #ffffff;
}
```

#### Tertiary (Neutral Outlined)
```css
.btn-tertiary {
  background: transparent;
  color: #1a1a1a;
  padding: 12px 28px;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
}

.btn-tertiary:hover {
  background: #1a1a1a;
  color: #ffffff;
}
```

### Links

- **Color:** Durham purple (#682860)
- **Hover:** Darker purple (#7a2d80)
- **Underline:** 2px solid, matches text color
- **Arrows:** Use `→` character or Font Awesome icon
- **Visited:** Same color (no distinction for consistency)

---

## 5. Implementation Priorities

### Phase 1: Foundation (Critical Path)
1. Update fonts in `Layout.astro` (Google Fonts CDN)
2. Update CSS variables in `src/styles/global.css` (Tailwind theme)
3. Update base typography in `public/css/tokens.css`
4. Replace gradient backgrounds with white/off-white alternation

### Phase 2: Layout
5. Implement asymmetric content blocks (update grid classes)
6. Add section numbering system (Space Mono labels)
7. Increase section padding (80px → 120px)
8. Redesign hero section (directional gradient, left-aligned text)

### Phase 3: Components
9. Replace glass-morphism cards with solid cards (update `public/css/cards.css`)
10. Update button styles (remove rounded-full, add outlined variants)
11. Redesign research cards, programme cards, team cards
12. Update navigation active/hover states

### Phase 4: Polish
13. Implement scroll reveal animations
14. Refine dark mode colors
15. Accessibility audit (contrast, keyboard nav, ARIA)
16. Performance optimization (font loading, image optimization)

---

## Success Metrics

### Qualitative Goals

- ✅ Site no longer feels "AI-generated" (serif typography, asymmetric layouts)
- ✅ Credible to academics (editorial aesthetic, generous whitespace)
- ✅ Approachable to students (modern color palette, clean UI)
- ✅ Durham purple visible but not overwhelming (accent usage only)
- ✅ Distinctive from other university AI Safety groups (unique typography pairing)

---

**End of Specification**

**Next Steps:** Create implementation plan breaking down this spec into discrete tasks.
