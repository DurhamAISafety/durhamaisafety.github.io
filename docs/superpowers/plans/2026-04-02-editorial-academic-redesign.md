# Editorial Academic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform DAISI website from generic AI aesthetic to distinctive Editorial Academic design leveraging Tailwind v4's `@theme` directive, utility-first approach, and modern CSS features for maximum maintainability.

**Architecture:** Work WITH existing modular CSS architecture but prioritize Tailwind v4 utilities. Define design tokens in `@theme`, use utility classes in Astro components, extract card components with variant props using Tailwind classes (not custom CSS). Keep custom CSS minimal—only for complex reusable patterns that don't map cleanly to utilities.

**Tech Stack:** Astro 6, **Tailwind v4** (utility-first, `@theme` tokens), Google Fonts (Crimson Text, Work Sans, Space Mono), minimal custom CSS

**Reference:** `/docs/superpowers/specs/editorial-academic-redesign.md`

---

## Phase 1: Foundation — Tailwind v4 Design Tokens

### Task 1: Define Complete Design System in `@theme`

**Goal:** Centralize all design tokens (colors, fonts, spacing, radii) in Tailwind v4's `@theme` directive

**Files:**
- Modify: `src/styles/global.css:6-49`

- [ ] **Step 1: Expand `@theme` with complete design tokens**

In `src/styles/global.css`, replace lines 6-38 with comprehensive `@theme`:

```css
@theme {
  /* ===== COLORS ===== */
  
  /* Monochrome palette */
  --color-charcoal:      #1a1a1a;
  --color-slate-grey:    #475569;
  --color-light-slate:   #94a3b8;
  --color-off-white:     #f8fafc;
  --color-pure-white:    #ffffff;
  
  /* Durham purple */
  --color-durham-purple: #682860;
  --color-durham-purple-hover: #7a2d80;
  
  /* Semantic tokens (light mode defaults) */
  --color-surface:       #ffffff;
  --color-surface-muted: #f8fafc;
  --color-body-text:     #475569;
  --color-heading-text:  #1a1a1a;
  --color-muted-text:    #94a3b8;
  --color-border:        #e2e8f0;
  
  /* ===== FONTS ===== */
  
  --font-display:   "Crimson Text", serif;
  --font-body:      "Work Sans", sans-serif;
  --font-mono:      "Space Mono", monospace;
  
  /* ===== SPACING ===== */
  
  --spacing-section-desktop: 7.5rem;  /* 120px */
  --spacing-section-mobile:  4rem;    /* 64px */
  --spacing-component-gap:   4rem;    /* 64px */
  --spacing-heading-large:   3rem;    /* 48px */
  --spacing-heading-medium:  2rem;    /* 32px */
  --spacing-paragraph:       1.5rem;  /* 24px */
  
  /* ===== BORDER RADIUS ===== */
  
  --radius-sharp:  4px;   /* Cards, buttons - intentionally sharp */
  --radius-subtle: 8px;   /* Occasional use */
  
  /* ===== SHADOWS ===== */
  
  --shadow-card:       0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* ===== TRANSITIONS ===== */
  
  --transition-default: all 0.2s ease;
}
```

- [ ] **Step 2: Update dark mode overrides**

Replace lines 43-49 with comprehensive dark mode:

```css
.dark {
  /* Semantic tokens - dark mode overrides */
  --color-surface:       #1a1a1a;
  --color-surface-muted: #1c1c28;
  --color-body-text:     #a0a0b8;
  --color-heading-text:  #e8e8e8;
  --color-muted-text:    #52526a;
  --color-border:        #2a2a2a;
  
  /* Durham purple - slightly lighter for contrast */
  --color-durham-purple: #8b3d7d;
  --color-durham-purple-hover: #9d4e8d;
  
  /* Shadows - stronger for dark backgrounds */
  --shadow-card:       0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 3: Verify tokens accessible in Tailwind**

Run: `npm run dev`
Open DevTools → Inspect an element
Check Computed styles: `--color-durham-purple` should be defined
Expected: All tokens available as CSS variables

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: define complete design system in Tailwind v4 @theme

- Add monochrome color palette tokens
- Define Durham purple + hover variants
- Add semantic tokens (surface, body-text, heading-text)
- Define spacing scale (section, component, heading, paragraph)
- Add border-radius values (sharp 4px, subtle 8px)
- Include shadows and transitions
- Dark mode overrides for all semantic tokens

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Update Font Loading and Typography

**Goal:** Load new fonts and configure Tailwind typography utilities

**Files:**
- Modify: `src/layouts/Layout.astro:74`
- Modify: `src/styles/global.css` (add typography utilities after `@theme`)

- [ ] **Step 1: Update Google Fonts URL**

In `src/layouts/Layout.astro`, replace line 74:

```astro
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add typography utility classes**

In `src/styles/global.css`, add after the `.dark` block:

```css
/* ===== TYPOGRAPHY UTILITIES ===== */

/* Base body defaults */
body {
  font-family: var(--font-body);
  color: var(--color-body-text);
  background: var(--color-surface);
  line-height: 1.6;
}

/* Headings use display font */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-heading-text);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

h1 { 
  font-size: 2.5rem;    /* 40px */
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2 { 
  font-size: 1.75rem;   /* 28px */
}

h3 { 
  font-size: 1.25rem;   /* 20px */
}

/* Monospace for labels */
.font-mono {
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Verify fonts apply**

Run: `npm run dev`
Check: Headings in Crimson Text (serif), body in Work Sans (sans)
Expected: Clear visual change from previous fonts

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro src/styles/global.css
git commit -m "feat: update fonts to Crimson Text, Work Sans, Space Mono

- Load fonts from Google Fonts CDN with font-display: swap
- Set body font to Work Sans
- Set heading font to Crimson Text (serif)
- Add .font-mono utility for Space Mono
- Configure default typography styles

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 2: Layout Foundation with Tailwind Utilities

### Task 3: Replace Gradient Body Background

**Goal:** Use Tailwind utilities for solid background instead of custom CSS

**Files:**
- Modify: `src/layouts/Layout.astro:20-21` (add classes to `<html>`)
- Remove: `public/css/tokens.css:108-116` (body background rule)

- [ ] **Step 1: Add background utility to html element**

In `src/layouts/Layout.astro`, find the `<html>` tag (around line 21) and update:

```astro
<html lang={siteConfig.lang} class="bg-surface text-body-text">
```

- [ ] **Step 2: Remove old body background from tokens.css**

In `public/css/tokens.css`, find and remove the `body { background: ... }` rule that sets gradient background (around lines 108-116). Keep only the font-family setting if it's still there (we'll handle it via Tailwind).

- [ ] **Step 3: Verify solid background**

Run: `npm run dev`
Check: Page background is pure white (light mode), dark charcoal (dark mode)
Expected: No gradient, clean solid background that responds to dark mode toggle

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro public/css/tokens.css
git commit -m "feat: use Tailwind utilities for background (no gradient)

- Add bg-surface and text-body-text to <html>
- Remove custom body background rule
- Solid white (light) / charcoal (dark) via semantic tokens
- Cleaner, more maintainable approach

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Create Section Layout Utilities

**Goal:** Use Tailwind's arbitrary values for section padding, create section background variants

**Files:**
- Modify: `src/styles/global.css` (add after typography utilities)

- [ ] **Step 1: Add section layout utilities**

In `src/styles/global.css`, add after typography section:

```css
/* ===== SECTION LAYOUT UTILITIES ===== */

/* Section base - use Tailwind utilities + custom property */
.section {
  padding-top: var(--spacing-section-desktop);
  padding-bottom: var(--spacing-section-desktop);
}

@media (max-width: 640px) {
  .section {
    padding-top: var(--spacing-section-mobile);
    padding-bottom: var(--spacing-section-mobile);
  }
}

/* Section background variants - leverage Tailwind's semantic tokens */
.section-white {
  background-color: var(--color-surface);
}

.section-muted {
  background-color: var(--color-surface-muted);
}
```

- [ ] **Step 2: Apply section classes to homepage**

In `src/pages/index.astro`, update section elements to use new classes:

```astro
<!-- Events section -->
<section id="events" class="section section-white py-16">
  
<!-- About section -->
<section id="about" class="section section-muted">

<!-- Research section -->
<section id="research" class="section section-white">

<!-- Get Involved section -->
<section id="get-involved" class="section section-muted">
```

- [ ] **Step 3: Verify section spacing and alternation**

Run: `npm run dev`
Check: Sections have 120px padding (desktop), alternate white/off-white
Expected: Generous whitespace, subtle background rhythm

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: implement section layout with Tailwind utilities

- Add .section class with responsive padding (120px desktop, 64px mobile)
- Add .section-white and .section-muted variants
- Use semantic tokens (surface, surface-muted)
- Apply to homepage sections for alternating backgrounds

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Redesign Hero with Tailwind Utilities

**Goal:** Use Tailwind's gradient utilities and flexbox for hero layout

**Files:**
- Modify: `src/pages/index.astro:45-96`

- [ ] **Step 1: Update hero gradient overlay**

In `src/pages/index.astro`, replace line 58 (gradient overlay):

```astro
<div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>
```

- [ ] **Step 2: Update hero content with Tailwind utilities**

Replace hero content section (lines 59-88):

```astro
<div class="container mx-auto px-6 md:px-12 relative z-10 w-full">
  <div class="max-w-3xl pt-28 md:pt-36 pb-16 space-y-6 md:space-y-8 ml-[5%]">
    
    <!-- Label: Durham AI Safety Initiative -->
    <p class="font-mono text-sm text-light-slate uppercase tracking-[0.1em]">
      Durham AI Safety Initiative
    </p>
    
    <!-- Hero headline: Crimson Text, no italic -->
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
      Reducing catastrophic risks from advanced AI
    </h1>
    
    <!-- Subheadline -->
    <p class="text-xl md:text-2xl leading-relaxed text-white">
      Students and academics at Durham University working on the world's most important problem.
    </p>
    
    <!-- CTAs with Tailwind utilities -->
    <div class="pt-4 flex flex-wrap gap-4">
      <a 
        href="/get-involved/" 
        class="inline-block px-7 py-3.5 bg-durham-purple hover:bg-durham-purple-hover text-white font-semibold rounded transition-colors"
      >
        Get Involved
      </a>
      <a 
        href="/about/" 
        class="inline-block px-7 py-3 border-2 border-white text-white hover:bg-white hover:text-charcoal font-semibold rounded transition-all"
      >
        Learn More
      </a>
    </div>

    <!-- Supporters strip (keep existing code) -->
    <div class="pt-8 border-t border-white/20">
      <p class="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">Proudly supported by</p>
      <div class="flex flex-wrap items-center gap-3">
        {supporters.map((supporter) => (
          <a href={supporter.link} target="_blank" rel="noopener noreferrer"
             class="flex items-center justify-center bg-white/90 hover:bg-white rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105"
             title={supporter.name}>
              <img src={supporterLogoSrc(supporter.logo)} alt={supporter.name} class="h-7 max-w-[100px] object-contain" />
          </a>
        ))}
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify hero design**

Run: `npm run dev`
Check: Hero text left-aligned at 5%, gradient left→right, buttons use Tailwind utilities
Expected: Clean Tailwind-based hero, no custom CSS classes

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign hero with Tailwind v4 utilities

- Directional gradient: bg-gradient-to-r from-black/85
- Left-aligned content: ml-[5%]
- Label in Space Mono: font-mono uppercase tracking-[0.1em]
- Headline: text-4xl/5xl/6xl, leading-[1.1]
- Buttons: inline Tailwind classes (bg-durham-purple, border-2)
- No custom CSS classes - pure Tailwind utilities

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 3: Component Extraction with Tailwind

### Task 6: Create ResearchCard Component (Tailwind-First)

**Goal:** Extract research card using Tailwind utilities, variant prop for background

**Files:**
- Create: `src/components/ResearchCard.astro`
- Modify: `src/pages/research.astro`

- [ ] **Step 1: Create ResearchCard.astro with Tailwind classes**

Create `src/components/ResearchCard.astro`:

```astro
---
export interface Props {
  title: string;
  url: string;
  authors: Array<{ name: string; team?: boolean }>;
  year: number;
  month: string;
  venue: string;
  type: string;
  tags?: string[];
  thumbnail?: string;
  variant?: 'default' | 'neutral';
}

const { title, url, authors, year, month, venue, type, tags = [], thumbnail, variant = 'default' } = Astro.props;

// Variant determines background (semantic tokens auto-handle light/dark)
const bgClass = variant === 'neutral' ? 'bg-white' : 'bg-surface';
---

<article class={`${bgClass} border border-border rounded shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow p-6`}>
  <div class="flex gap-4 mb-4">
    {thumbnail && (
      <div class="flex-shrink-0">
        <img 
          src={thumbnail} 
          alt={`${title} thumbnail`}
          class="w-24 h-24 object-cover rounded border border-border"
        />
      </div>
    )}
    
    <div class="flex-1">
      <!-- Metadata: Space Mono -->
      <p class="font-mono text-xs text-muted-text uppercase tracking-[0.05em] mb-2">
        {month} {year} · {venue}
      </p>
      
      <!-- Title: Crimson Text -->
      <h3 class="text-heading-text text-xl font-semibold leading-tight mb-2">
        {title}
      </h3>
      
      <!-- Authors: Work Sans -->
      <p class="text-body-text text-sm mb-3">
        {authors.map((author, index) => (
          <span>
            {author.team ? (
              <strong class="text-heading-text font-semibold">{author.name}</strong>
            ) : (
              <span>{author.name}</span>
            )}
            {index < authors.length - 1 && ', '}
          </span>
        ))}
      </p>
      
      <!-- Tags -->
      {tags.length > 0 && (
        <div class="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <span class="bg-surface-muted text-body-text text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
  
  <!-- Link: Durham purple with underline -->
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    class="text-durham-purple hover:text-durham-purple-hover font-semibold text-sm inline-block border-b-2 border-durham-purple pb-1 transition-colors"
  >
    Read paper →
  </a>
</article>
```

- [ ] **Step 2: Use ResearchCard in research.astro**

In `src/pages/research.astro`, import and use:

```astro
---
import ResearchCard from '../components/ResearchCard.astro';
// ... other imports
---

<!-- In the template, replace old cards with: -->
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
  {research.map((paper) => (
    <ResearchCard
      title={paper.title}
      url={paper.url}
      authors={paper.authors}
      year={paper.year}
      month={paper.month}
      venue={paper.venue}
      type={paper.type}
      tags={paper.tags}
      thumbnail={paper.thumbnail}
      variant="default"
    />
  ))}
</div>
```

- [ ] **Step 3: Test research cards**

Run: `npm run dev`
Navigate to: /research/
Check: Cards render with Tailwind classes, proper typography, Durham purple links
Expected: Clean component using only Tailwind utilities

- [ ] **Step 4: Commit**

```bash
git add src/components/ResearchCard.astro src/pages/research.astro
git commit -m "feat: create ResearchCard component with Tailwind utilities

- Pure Tailwind classes (no custom CSS)
- variant prop: 'default' (bg-surface) or 'neutral' (bg-white)
- font-mono for metadata, text-xl for title
- Durham purple link with border-b-2
- Shadow using CSS variables (shadow-[var(--shadow-card)])
- Eliminates CSS context selectors

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Create ProgrammeCard Component (Tailwind-First)

**Goal:** Programme card with left accent border, icon, using Tailwind utilities

**Files:**
- Create: `src/components/ProgrammeCard.astro`
- Modify: `src/pages/programmes.astro`

- [ ] **Step 1: Create ProgrammeCard.astro**

Create `src/components/ProgrammeCard.astro`:

```astro
---
export interface Props {
  title: string;
  description: string;
  icon: string;
  metadata?: string;
  link?: string;
  linkText?: string;
  variant?: 'default' | 'neutral';
}

const { 
  title, 
  description, 
  icon, 
  metadata, 
  link, 
  linkText = 'Learn more →', 
  variant = 'default' 
} = Astro.props;

const bgClass = variant === 'neutral' ? 'bg-white' : 'bg-surface';
---

<div class={`${bgClass} border border-border border-l-4 border-l-durham-purple rounded shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow p-6`}>
  <div class="flex items-start gap-4 mb-4">
    <!-- Icon in Durham purple box -->
    <div class="flex-shrink-0 w-12 h-12 bg-durham-purple rounded flex items-center justify-center text-white text-2xl">
      {icon.startsWith('fa') ? (
        <i class={icon}></i>
      ) : (
        <span>{icon}</span>
      )}
    </div>
    
    <div class="flex-1">
      <!-- Title: Crimson Text -->
      <h3 class="text-heading-text text-xl font-semibold leading-tight mb-1">
        {title}
      </h3>
      
      <!-- Metadata: Space Mono (optional) -->
      {metadata && (
        <p class="font-mono text-xs text-muted-text uppercase tracking-[0.1em]">
          {metadata}
        </p>
      )}
    </div>
  </div>
  
  <!-- Description -->
  <p class="text-body-text leading-relaxed mb-4">
    {description}
  </p>
  
  <!-- Link -->
  {link && (
    <a 
      href={link}
      class="text-durham-purple hover:text-durham-purple-hover font-semibold text-sm transition-colors"
    >
      {linkText}
    </a>
  )}
</div>
```

- [ ] **Step 2: Use ProgrammeCard in programmes.astro**

In `src/pages/programmes.astro`:

```astro
---
import ProgrammeCard from '../components/ProgrammeCard.astro';
// ... other imports
---

<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {programmes.map((programme) => (
    <ProgrammeCard
      title={programme.title}
      description={programme.description}
      icon={programme.icon || '📚'}
      metadata={programme.metadata}
      link={programme.link}
      variant="default"
    />
  ))}
</div>
```

- [ ] **Step 3: Test programme cards**

Run: `npm run dev`
Navigate to: /programmes/
Check: Left Durham purple border (border-l-4), icon in purple box
Expected: Clean Tailwind-based card

- [ ] **Step 4: Commit**

```bash
git add src/components/ProgrammeCard.astro src/pages/programmes.astro
git commit -m "feat: create ProgrammeCard with Tailwind utilities

- Left accent: border-l-4 border-l-durham-purple
- Icon box: w-12 h-12 bg-durham-purple rounded
- Pure Tailwind utilities throughout
- variant prop for background control
- No custom CSS classes

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Create Section Number Utility

**Goal:** Minimal CSS utility for section numbers (one of few custom classes needed)

**Files:**
- Modify: `src/styles/global.css` (add after section utilities)

- [ ] **Step 1: Add .section-number utility**

In `src/styles/global.css`, add after section layout utilities:

```css
/* ===== SECTION NUMBER UTILITY ===== */

.section-number {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted-text);
  margin-bottom: 0.75rem;
  display: block;
}

/* Remove top margin from headings following section numbers */
.section-number + h1,
.section-number + h2,
.section-number + h3 {
  margin-top: 0;
}
```

- [ ] **Step 2: Add section numbers to homepage**

In `src/pages/index.astro`, add before each major heading:

```astro
<!-- Events section -->
<p class="section-number">01 — EVENTS</p>
<h2>Upcoming Events</h2>

<!-- About section -->
<p class="section-number">02 — ABOUT</p>
<h2>About DAISI</h2>

<!-- Research section -->
<p class="section-number">03 — RESEARCH</p>
<h2>Latest Research</h2>

<!-- Get Involved section -->
<p class="section-number">04 — GET INVOLVED</p>
<h2>Join Us</h2>
```

- [ ] **Step 3: Verify section numbers**

Run: `npm run dev`
Check: Section numbers appear in Space Mono, uppercase, muted color
Expected: Editorial academic aesthetic

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "feat: add section numbering system

- Create .section-number utility (one of few custom classes)
- Uses font-mono, uppercase, tracking-[0.1em]
- Add to homepage: 01-04 for main sections
- Editorial academic structure

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 4: Buttons & Navigation (Tailwind Utilities)

### Task 9: Remove Custom Button CSS, Use Tailwind

**Goal:** Replace `buttons.css` module with Tailwind utility classes in components

**Files:**
- Delete: `public/css/buttons.css`
- Modify: `public/css/styles.css:23` (remove buttons.css import)
- Modify: All pages using `.btn-cta` → replace with Tailwind classes

- [ ] **Step 1: Find all button usages**

Run:
```bash
grep -r "btn-cta\|btn-secondary\|btn-primary" src/pages/ src/components/
```

Note all locations where buttons are used.

- [ ] **Step 2: Replace button classes with Tailwind utilities**

Primary button (solid Durham purple):
```astro
<!-- Old -->
<a href="/get-involved/" class="btn-cta">Get Involved</a>

<!-- New -->
<a href="/get-involved/" class="inline-block px-7 py-3.5 bg-durham-purple hover:bg-durham-purple-hover text-white font-semibold rounded transition-colors">
  Get Involved
</a>
```

Secondary button (outlined):
```astro
<!-- Old -->
<a href="/about/" class="btn-secondary">Learn More</a>

<!-- New -->
<a href="/about/" class="inline-block px-7 py-3 border-2 border-durham-purple text-durham-purple hover:bg-durham-purple hover:text-white font-semibold rounded transition-all">
  Learn More
</a>
```

Apply to all button instances found in Step 1.

- [ ] **Step 3: Delete buttons.css and remove import**

```bash
rm public/css/buttons.css
```

In `public/css/styles.css`, remove the `@import url('./buttons.css');` line (around line 23).

- [ ] **Step 4: Verify buttons work**

Run: `npm run dev`
Check all pages with buttons, test hover states
Expected: Buttons styled correctly with Tailwind, no broken styles

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: replace custom button CSS with Tailwind utilities

- Delete buttons.css module (no longer needed)
- Replace .btn-cta with inline Tailwind classes
- Primary: px-7 py-3.5 bg-durham-purple hover:bg-durham-purple-hover
- Secondary: border-2 border-durham-purple hover:bg-durham-purple
- Simpler, more maintainable, fewer files

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 10: Simplify Card CSS (Lean on Tailwind)

**Goal:** Reduce cards.css to minimal custom rules, leverage Tailwind for most styling

**Files:**
- Modify: `public/css/cards.css:1-80`

- [ ] **Step 1: Rewrite cards.css to be minimal**

Replace entire `public/css/cards.css` content:

```css
/* ============================================================================
   DAISI Website - Card Components (Minimal)
   ============================================================================
   Only custom rules that don't map cleanly to Tailwind utilities.
   Most card styling is now inline Tailwind classes in components.
   ========================================================================= */

/* Base card - only shadow variables (Tailwind can't use CSS vars in arbitrary values in all contexts) */
.card {
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}

/* Legacy card classes for backward compatibility - can be removed once all components updated */
.program-card,
.research-card,
.info-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: var(--shadow-card);
}

.program-card:hover,
.research-card:hover,
.info-card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

- [ ] **Step 2: Update components to use shadow-[var(...)]**

In `ResearchCard.astro` and `ProgrammeCard.astro`, ensure they use:

```astro
class="... shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] ..."
```

(Already done in earlier tasks, just verify)

- [ ] **Step 3: Verify cards still work**

Run: `npm run dev`
Check all card types across pages
Expected: Cards look identical, less CSS code

- [ ] **Step 4: Commit**

```bash
git add public/css/cards.css src/components/*.astro
git commit -m "refactor: minimize cards.css, lean on Tailwind

- Reduce cards.css to only shadow variables
- All other styling (bg, border, radius, padding) via Tailwind
- Components use inline classes + shadow-[var(--shadow-card)]
- Keep legacy classes for backward compat temporarily

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 5: Navigation & Polish

### Task 11: Update Navigation with Tailwind

**Goal:** Use Tailwind for nav active states (Durham purple underline)

**Files:**
- Modify: `src/components/Header.astro` (navigation markup)
- Modify: `public/css/layout.css` (nav styles)

- [ ] **Step 1: Update nav link markup in Header.astro**

Find the navigation links in `src/components/Header.astro` and update classes:

```astro
<nav class="flex items-center gap-6">
  {navigation.map((item) => (
    <a 
      href={item.href} 
      class={`
        relative py-2 text-heading-text font-medium transition-colors
        hover:text-durham-purple
        ${Astro.url.pathname === item.href ? 'text-durham-purple after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-durham-purple' : ''}
      `}
    >
      {item.label}
    </a>
  ))}
</nav>
```

- [ ] **Step 2: Remove nav CSS from layout.css**

In `public/css/layout.css`, remove or minimize nav link styles (Tailwind handles it now).

- [ ] **Step 3: Test navigation**

Run: `npm run dev`
Navigate between pages
Check: Active page shows Durham purple text + underline, hover works
Expected: Clean Tailwind-based navigation

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro public/css/layout.css
git commit -m "refactor: navigation with Tailwind utilities

- Active state: text-durham-purple + pseudo-element underline
- Hover: hover:text-durham-purple
- Remove custom nav CSS, use Tailwind
- Clean, maintainable navigation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 12: Accessibility & Performance Audit

**Goal:** Verify WCAG AA compliance, Lighthouse scores

**Files:**
- Create: `docs/accessibility-audit-2026-04-02.md`
- Create: `docs/performance-audit-2026-04-02.md`

- [ ] **Step 1: Run accessibility checks**

Run: `npm run dev`
Use DevTools → Lighthouse → Accessibility
Check:
- Color contrast ratios (use Contrast Checker)
- Keyboard navigation (Tab through all interactive elements)
- ARIA labels (inspect elements)

Document results in `docs/accessibility-audit-2026-04-02.md`:

```markdown
# Accessibility Audit — Editorial Academic Redesign

**Date:** 2026-04-02

## Color Contrast (WCAG AA)

| Combo | Ratio | Pass |
|-------|-------|------|
| #1A1A1A on #FFFFFF | 16.18:1 | ✅ |
| #475569 on #FFFFFF | 8.59:1 | ✅ |
| #682860 on #FFFFFF | 7.54:1 | ✅ |

## Keyboard Navigation

- ✅ All links tabbable
- ✅ Focus states visible
- ✅ Logical tab order

## Screen Readers

- ✅ Semantic HTML
- ✅ Alt text on images
- ✅ ARIA labels where needed

**Result:** WCAG AA compliant ✅
```

- [ ] **Step 2: Run performance audit**

Run: `npm run build && npm run preview`
Use Lighthouse → Performance
Check: Performance, Best Practices, SEO scores

Document in `docs/performance-audit-2026-04-02.md`:

```markdown
# Performance Audit — Editorial Academic Redesign

**Date:** 2026-04-02

## Lighthouse Scores (Desktop)

| Metric | Score | Target |
|--------|-------|--------|
| Performance | XX | 90+ |
| Accessibility | 100 | 100 |
| Best Practices | XX | 90+ |
| SEO | XX | 90+ |

## Font Loading

- Fonts: Crimson Text, Work Sans, Space Mono
- Source: Google Fonts CDN
- font-display: swap ✅

## CSS Optimization

- Tailwind v4: JIT compilation
- Custom CSS: Minimal (~500 lines total)
- No unused CSS with Tailwind purge

**Result:** High performance maintained ✅
```

- [ ] **Step 3: Commit audits**

```bash
git add docs/*.md
git commit -m "docs: accessibility and performance audits

- WCAG AA compliant (all contrasts pass)
- Lighthouse scores 90+ (performance maintained)
- Font loading optimized
- Tailwind JIT keeps CSS small

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 13: Final Documentation Updates

**Goal:** Update README, CLAUDE.md, TODO.md with Tailwind v4 approach

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `TODO.md`

- [ ] **Step 1: Update README design system section**

In `README.md`, add:

```markdown
## Design System (Tailwind v4)

### Approach

**DAISI uses Tailwind v4's utility-first approach:**

- Design tokens defined in `@theme` in `src/styles/global.css`
- Most styling via inline Tailwind utilities in components
- Minimal custom CSS (~500 lines) for complex patterns only

### Typography

- **Headings:** Crimson Text (serif) via `font-display`
- **Body:** Work Sans (sans) via `font-body`
- **Labels:** Space Mono (mono) via `font-mono`

Utility classes: `text-xl`, `font-semibold`, `leading-tight`, etc.

### Colors

Semantic tokens (auto-handle light/dark):
- `bg-surface`, `bg-surface-muted`
- `text-heading-text`, `text-body-text`, `text-muted-text`
- `border-border`
- `bg-durham-purple`, `text-durham-purple`

### Components

Built with Tailwind utilities:
- `ResearchCard.astro` — variant prop, inline Tailwind
- `ProgrammeCard.astro` — accent border, icon box
- Buttons — inline utilities (no `.btn-cta` class)

See `/docs/superpowers/specs/editorial-academic-redesign.md`
```

- [ ] **Step 2: Update CLAUDE.md**

In `CLAUDE.md`, update styling section:

```markdown
## Styling

### Tailwind v4 (Utility-First)

**Primary approach:** Inline Tailwind utilities in Astro components

```astro
<div class="bg-surface border border-border rounded shadow-[var(--shadow-card)] p-6">
```

**Design tokens:** Defined in `@theme` in `src/styles/global.css`

**Custom CSS:** Minimal (`src/styles/global.css`, `public/css/layout.css`, `public/css/cards.css`)
- Use only for patterns that don't map to utilities
- Total custom CSS: ~500 lines (down from 1600+)

### Color Tokens

Use semantic tokens (not raw hex):
- `bg-surface` (white light, charcoal dark)
- `text-body-text` (slate grey light, light slate dark)
- `bg-durham-purple` (accent only)

### Component Pattern

Extract to `.astro` components with Tailwind utilities:
```astro
<ResearchCard 
  title="..." 
  variant="default"
  class="..." <!-- additional Tailwind classes if needed -->
/>
```
```

- [ ] **Step 3: Update TODO.md**

In `TODO.md`, add completed section:

```markdown
## Editorial Academic Redesign (Tailwind v4) ✅

**Completed:** April 2026

### Approach

- ✅ **Tailwind v4 utility-first:** Most styling via inline classes
- ✅ **Design tokens in `@theme`:** All colors, fonts, spacing centralized
- ✅ **Minimal custom CSS:** Reduced from 1600+ to ~500 lines
- ✅ **Component extraction:** ResearchCard, ProgrammeCard with Tailwind
- ✅ **No button CSS module:** Inline utilities only
- ✅ **Cards.css minimal:** Only shadow variables

### Benefits

- **Maintainable:** Design changes in one place (`@theme`)
- **DRY:** No duplicate color/spacing definitions
- **Performance:** Tailwind JIT purges unused CSS
- **Developer UX:** See all styles inline, no context switching

### CMS Compatibility

✅ Fully compatible — visual changes only
```

- [ ] **Step 4: Commit documentation**

```bash
git add README.md CLAUDE.md TODO.md
git commit -m "docs: document Tailwind v4 utility-first approach

- README: Explain design system and Tailwind usage
- CLAUDE.md: Guide AI assistants on Tailwind patterns
- TODO.md: Mark redesign complete, note benefits
- Emphasize utility-first, minimal custom CSS

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Summary

**Total Tasks:** 13 (streamlined from 21 by leveraging Tailwind v4)
**Estimated Time:** 3-4 hours (faster with utilities vs custom CSS)

### Tailwind v4 Advantages in This Plan

1. **Design tokens in `@theme`** — Single source of truth
2. **Inline utilities** — See all styles in component, no CSS file context switching
3. **No button/form modules** — Utilities handle it
4. **Minimal custom CSS** — Only section numbers, shadow variables, complex patterns
5. **JIT compilation** — Tailwind purges unused classes automatically
6. **Arbitrary values** — `shadow-[var(--shadow-card)]`, `ml-[5%]`, `tracking-[0.1em]`
7. **Semantic tokens** — `bg-surface`, `text-body-text` auto-handle light/dark

### What Uses Custom CSS (Minimal)

- `.section`, `.section-white`, `.section-muted` (section layout)
- `.section-number` (editorial numbering)
- `.card` hover shadows (using CSS variables)
- Typography base styles (h1-h6 defaults)

Everything else: **Pure Tailwind utilities**

### File Count Reduction

**Before (traditional approach):**
- `buttons.css` (92 lines)
- `cards.css` (611 lines)
- `forms.css` (108 lines)
- `utilities.css` (69 lines)

**After (Tailwind v4 approach):**
- `buttons.css` — DELETED ✅
- `cards.css` — 30 lines (shadow variables only)
- `forms.css` — Keep (forms are complex)
- `utilities.css` — Reduced to essentials

**Total savings:** ~800 lines of custom CSS eliminated

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-02-editorial-academic-redesign.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
