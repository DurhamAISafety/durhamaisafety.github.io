# Repo Cleanup And CMS Visual Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the repository lockfiles, migrate page copy from `site-config.json` into page-owned CMS documents, split the homepage into modular sections, unify supporter rendering, add custom validation, and set up tsconfig.json.

**Architecture:** We will proceed incrementally across three phases. Phase 1 splits the schema and loader paths for Page Copy and Site Config; Phase 2 refactors index.astro into modular components and unifies the supporter presentation; Phase 3 configures the TypeScript environment and updates internal docs.

**Tech Stack:** Astro 5, TypeScript, Tina CMS, Vanilla CSS

---

## Phase 1: CMS Migration, Schema Overhaul & Loaders

### Task 1.1: Remove Accidental pnpm Files and Enforce npm
**Goal:** Ensure the repository remains strictly on npm and clean up the dirty workspace lockfiles.
**Files:**
- Delete: `pnpm-lock.yaml`
- Delete: `pnpm-workspace.yaml`
- Modify: `package.json`

- [ ] **Step 1.1.1: Remove pnpm-lock.yaml**
  Run: `rm -f pnpm-lock.yaml`

- [ ] **Step 1.1.2: Remove pnpm-workspace.yaml**
  Run: `rm -f pnpm-workspace.yaml`

- [ ] **Step 1.1.3: Set packageManager in package.json**
  Modify `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/package.json` to ensure `"packageManager": "npm@11.6.2"` is defined at the root level.
  Code diff:
  ```diff
    {
      "name": "durham-ai-safety",
      "version": "1.0.0",
  +   "packageManager": "npm@11.6.2",
      "scripts": { ... }
    }
  ```

- [ ] **Step 1.1.4: Run npm install**
  Run: `npm install`
  Expected: Clean, standard npm audit output and successful installation.

- [ ] **Step 1.1.5: Commit**
  Run: `rtk git add package.json && rtk git commit -m "chore: enforce npm and remove pnpm lockfiles"`

---

### Task 1.2: Content File Migration
**Goal:** Create page-owned content files.
**Files:**
- Create: `src/content/pages/home.yml`
- Create: `src/content/pages/about.yml`
- Create: `src/content/pages/research.yml`

- [ ] **Step 1.2.1: Create home.yml**
  Create `src/content/pages/home.yml` with the following content:
  ```yaml
  home:
    heroTitle: "Durham students and academics for <em>reducing catastrophic risks from advanced AI</em>"
    heroSubtitleHighlight: "Whatever your expertise,"
    heroSubtitleMain: "you can contribute to the conversation and make a difference."
    heroPrimaryCtaText: "Get Involved"
    heroPrimaryCtaLink: "/get-involved/"
    heroSecondaryCtaText: "About"
    heroSecondaryCtaLink: "/about/"
    eventsTitle: "Our Events"
    programmesTitle: "Our Programmes"
    researchTitle: "Research"
    researchSubtitle: "Latest Publications & Projects"
    researchViewAllText: "View All Research"
  ```

- [ ] **Step 1.2.2: Create about.yml**
  Create `src/content/pages/about.yml` with the following content:
  ```yaml
  about:
    introText: "We are a <a href=\"#team\" class=\"text-bright-purple hover:text-light-purple font-semibold transition-colors underline decoration-bright-purple/50 hover:decoration-light-purple\">student-led</a> initiative that aims to empower students and academics to <a href=\"/what-is-ai-safety/\" class=\"text-bright-purple hover:text-light-purple font-semibold transition-colors underline decoration-bright-purple/50 hover:decoration-light-purple\">reduce risk from advanced AI</a>, by:"
    missionCards:
      - icon: "fas fa-bullhorn"
        title: "Raising Awareness"
        description: "Through discussion groups and speaker events"
      - icon: "fas fa-tools"
        title: "Upskilling Members"
        description: "In safety techniques through workshops and 1-1 support"
      - icon: "fas fa-users"
        title: "Fostering Community"
        description: "For high-quality discussion, support and connections to the wider field of AI safety"
    impactTitle: "Our Impact"
    impactIcon: "fas fa-chart-line"
    impactText: "Our members have published in top AI and law conferences, participated in <a href=\"https://www.matsprogram.org/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-durham-purple hover:text-bright-purple font-semibold transition-colors underline\">MATS</a> and gone on to study AI ethics at Cambridge."
    joinTitle: "Join Our Team"
    joinText: "If you want to help organise and shape DAISI, contact <a href=\"mailto:durhamaisi@durham.ac.uk\" class=\"text-bright-purple hover:text-light-purple font-semibold transition-colors\">durhamaisi@durham.ac.uk</a> and we'll be in touch!"
  ```

- [ ] **Step 1.2.3: Create research.yml**
  Create `src/content/pages/research.yml` with the following content:
  ```yaml
  research:
    opportunitiesTitle: "Research Opportunities"
    opportunities:
      - icon: "fas fa-graduation-cap"
        iconColor: "text-bright-purple"
        title: "Undergraduates"
        description: "We can advise and support you on dissertation and individual study projects."
      - icon: "fas fa-user-graduate"
        iconColor: "text-light-purple"
        title: "Faculty"
        description: "We can signpost promising research directions and funding opportunities, and support you throughout."
    opportunitiesCtaText: "I'm Interested"
    opportunitiesCtaLink: "/programmes/#research-projects"
    areasTitle: "Research Areas"
    researchAreas:
      - icon: "fas fa-search"
        iconColor: "text-bright-purple"
        title: "Interpretability"
        description: "Understanding how AI systems make decisions and what they learn from data."
        linkUrl: "https://arxiv.org/abs/2501.16496"
      - icon: "fas fa-gavel"
        iconColor: "text-light-purple"
        title: "Governance"
        description: "Developing frameworks for responsible AI development and deployment."
        linkUrl: "https://www.markusanderljung.com/blog/a-collection-of-ai-governance-research-ideas-2024"
      - icon: "fas fa-clipboard-check"
        iconColor: "text-deep-purple"
        title: "Evaluations"
        description: "Developing methods to assess AI capabilities, alignment, and safety properties."
        linkUrl: "https://cset.georgetown.edu/article/ai-safety-evaluations-an-explainer/"
      - icon: "fas fa-user-shield"
        iconColor: "text-lavender"
        title: "Oversight / Control"
        description: "Ensuring meaningful human oversight and control over AI systems."
        linkUrl: "https://blog.redwoodresearch.org/p/guide"
      - icon: "fas fa-robot"
        iconColor: "text-violet-600"
        title: "AI Agency"
        description: "Understanding and managing autonomous AI behavior and decision-making."
        linkUrl: "https://aisafety.info/questions/7782/What-is-%22agent-foundations%22"
      - icon: "fas fa-shield-alt"
        iconColor: "text-fuchsia-600"
        title: "Security"
        description: "Protecting AI systems from adversarial attacks and malicious use."
        linkUrl: "https://www.aisi.gov.uk/research?1_category_equal=%5B%22Red+Team%22%5D"
  ```

- [ ] **Step 1.2.4: Commit**
  Run: `rtk git add src/content/pages/ && rtk git commit -m "feat: migrate page content to home, about, and research YAML files"`

---

### Task 1.3: Tina Schema Changes
**Goal:** Redefine schemas and remove redundant copy properties from Site Config.
**Files:**
- Modify: `tina/config.ts`

- [ ] **Step 1.3.1: Modify tina/config.ts**
  Open `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/tina/config.ts`.
  1. Remove `homepage`, `aboutPage`, and `researchPage` fields from the `siteConfig` collection.
  2. Register three new collections at the end of the `collections` array:
  ```typescript
      // ── Home Page ──────────────────────────────────────────────────────────
      {
        name: "homePage",
        label: "Home Page",
        path: "src/content/pages",
        format: "yml",
        match: {
          include: "home",
        },
        ui: {
          router: () => "/",
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "home",
            label: "Home Page Content",
            fields: [
              { type: "string", name: "heroTitle", label: "Hero Title", required: true },
              { type: "string", name: "heroSubtitleHighlight", label: "Hero Subtitle Highlight", required: true },
              { type: "string", name: "heroSubtitleMain", label: "Hero Subtitle Main", required: true },
              { type: "string", name: "heroPrimaryCtaText", label: "Hero Primary CTA Text", required: true },
              { type: "string", name: "heroPrimaryCtaLink", label: "Hero Primary CTA Link", required: true },
              { type: "string", name: "heroSecondaryCtaText", label: "Hero Secondary CTA Text", required: true },
              { type: "string", name: "heroSecondaryCtaLink", label: "Hero Secondary CTA Link", required: true },
              { type: "string", name: "eventsTitle", label: "Events Section Title", required: true },
              { type: "string", name: "programmesTitle", label: "Programmes Section Title", required: true },
              { type: "string", name: "researchTitle", label: "Research Section Title", required: true },
              { type: "string", name: "researchSubtitle", label: "Research Carousel Subtitle", required: true },
              { type: "string", name: "researchViewAllText", label: "Research View All Text", required: true },
            ],
          },
        ],
      },
      // ── About Page ─────────────────────────────────────────────────────────
      {
        name: "aboutPage",
        label: "About Page",
        path: "src/content/pages",
        format: "yml",
        match: {
          include: "about",
        },
        ui: {
          router: () => "/about/",
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "about",
            label: "About Page Content",
            fields: [
              { type: "string", name: "introText", label: "Intro Text", required: true, ui: { component: "textarea" } },
              {
                type: "object",
                name: "missionCards",
                label: "Mission Cards",
                list: true,
                fields: [
                  { type: "string", name: "icon", label: "Font Awesome Icon", required: true },
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
                ],
              },
              { type: "string", name: "impactTitle", label: "Impact Title", required: true },
              { type: "string", name: "impactIcon", label: "Impact Icon", required: true },
              { type: "string", name: "impactText", label: "Impact Text", required: true, ui: { component: "textarea" } },
              { type: "string", name: "joinTitle", label: "Join Title", required: true },
              { type: "string", name: "joinText", label: "Join Text", required: true, ui: { component: "textarea" } },
            ],
          },
        ],
      },
      // ── Research Page ──────────────────────────────────────────────────────
      {
        name: "researchPage",
        label: "Research Page",
        path: "src/content/pages",
        format: "yml",
        match: {
          include: "research",
        },
        ui: {
          router: () => "/research/",
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "research",
            label: "Research Page Content",
            fields: [
              { type: "string", name: "opportunitiesTitle", label: "Opportunities Title", required: true },
              {
                type: "object",
                name: "opportunities",
                label: "Opportunities",
                list: true,
                fields: [
                  { type: "string", name: "icon", label: "Icon Class", required: true },
                  {
                    type: "string",
                    name: "iconColor",
                    label: "Icon Color Class",
                    required: true,
                    options: [
                      { label: "Bright Purple", value: "text-bright-purple" },
                      { label: "Light Purple", value: "text-light-purple" },
                      { label: "Deep Purple", value: "text-deep-purple" },
                      { label: "Lavender", value: "text-lavender" },
                    ],
                  },
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
                ],
              },
              { type: "string", name: "opportunitiesCtaText", label: "Opportunities CTA Text", required: true },
              { type: "string", name: "opportunitiesCtaLink", label: "Opportunities CTA Link", required: true },
              { type: "string", name: "areasTitle", label: "Areas Title", required: true },
              {
                type: "object",
                name: "researchAreas",
                label: "Research Areas",
                list: true,
                fields: [
                  { type: "string", name: "icon", label: "Icon Class", required: true },
                  {
                    type: "string",
                    name: "iconColor",
                    label: "Icon Color Class",
                    required: true,
                    options: [
                      { label: "Bright Purple", value: "text-bright-purple" },
                      { label: "Light Purple", value: "text-light-purple" },
                      { label: "Deep Purple", value: "text-deep-purple" },
                      { label: "Lavender", value: "text-lavender" },
                      { label: "Violet 600", value: "text-violet-600" },
                      { label: "Fuchsia 600", value: "text-fuchsia-600" },
                    ],
                  },
                  { type: "string", name: "title", label: "Title", required: true },
                  { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
                  { type: "string", name: "linkUrl", label: "Link URL", required: true },
                ],
              },
            ],
          },
        ],
      },
  ```

- [ ] **Step 1.3.2: Clean up site-config.json content**
  Remove `homepage`, `aboutPage`, and `researchPage` keys from `src/content/site-config.json` manually, keeping only standard layout keys.

- [ ] **Step 1.3.3: Commit**
  Run: `rtk git add tina/config.ts src/content/site-config.json && rtk git commit -m "feat(cms): register homePage, aboutPage, researchPage collections and strip global site-config"`

---

### Task 1.4: Generated Type Refresh
**Goal:** Generate matching typescript and client query files based on the new schema.
**Files:**
- None (Automatic codegen)

- [ ] **Step 1.4.1: Run Tina schema compiler**
  Run: `npx tinacms schema:compile`
  Expected: Clean compilation success.

- [ ] **Step 1.4.2: Run Tina client codegen**
  Run: `npx tinacms codegen`
  Expected: Success in generating types under `tina/__generated__/`.

- [ ] **Step 1.4.3: Commit generated files**
  Run: `rtk git add tina/__generated__/ && rtk git commit -m "chore: compile tina schemas and refresh dynamic generated types"`

---

### Task 1.5: Loader Refactor & Validation
**Goal:** Create page-specific loaders, remove shims/types, and implement a custom type-safe validator.
**Files:**
- Modify: `src/data/config.ts`

- [ ] **Step 1.5.1: Modify src/data/config.ts**
  Refactor `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/data/config.ts` to implement loaders and validation rules.
  ```typescript
  import { requestWithMetadata } from '@tinacms/astro';
  import client from '../../tina/__generated__/client';
  import type { SiteConfigQuery, HomePageQuery, AboutPageQuery, ResearchPageQuery } from '../../tina/__generated__/types';

  export interface SocialLink {
    name: string;
    url: string;
    icon: string;
    inHeader: boolean;
    _index: number;
  }

  export interface NavigationItem {
    title: string;
    url: string;
  }

  export interface CalendarConfig {
    lumaCalendarId: string;
    lumaCalendarSlug: string;
    googleCalendarBackupId: string;
  }

  export interface SiteConfig {
    title: string;
    description: string;
    email: string;
    ogImage?: string;
    socialLinks: SocialLink[];
    navigation: {
      main: NavigationItem[];
      cta: NavigationItem;
    };
    footerTagline?: string;
    calendar: CalendarConfig;
    url: string;
    lang: string;
    repository: string;
    showEditLink: boolean;
    googleSiteVerification: string;
    _source: any;
  }

  // Simple, lightweight validation helper
  function validatePath(path: string, fieldName: string) {
    if (path && !path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://')) {
      throw new Error(`Validation Error: Path "${path}" in field "${fieldName}" must start with a leading slash "/" or be a fully qualified URL.`);
    }
  }

  export async function getHomePageContent() {
    const result = await requestWithMetadata(
      client.queries.homePage({ relativePath: 'home.yml' })
    );
    const doc = result.data.homePage.home;
    if (!doc) throw new Error("Validation Error: Missing home page configuration object.");
    
    // Validate paths
    validatePath(doc.heroPrimaryCtaLink ?? '', 'heroPrimaryCtaLink');
    validatePath(doc.heroSecondaryCtaLink ?? '', 'heroSecondaryCtaLink');

    return {
      document: result.data.homePage,
      homeConfig: doc,
    };
  }

  export async function getAboutPageContent() {
    const result = await requestWithMetadata(
      client.queries.aboutPage({ relativePath: 'about.yml' })
    );
    const doc = result.data.aboutPage.about;
    if (!doc) throw new Error("Validation Error: Missing about page configuration object.");

    return {
      document: result.data.aboutPage,
      aboutConfig: doc,
    };
  }

  export async function getResearchPageContent() {
    const result = await requestWithMetadata(
      client.queries.researchPage({ relativePath: 'research.yml' })
    );
    const doc = result.data.researchPage.research;
    if (!doc) throw new Error("Validation Error: Missing research page configuration object.");

    validatePath(doc.opportunitiesCtaLink ?? '', 'opportunitiesCtaLink');
    (doc.researchAreas ?? []).forEach((area, idx) => {
      validatePath(area?.linkUrl ?? '', `researchAreas.${idx}.linkUrl`);
    });

    return {
      document: result.data.researchPage,
      researchConfig: doc,
    };
  }

  export async function getSiteConfigContent(): Promise<{
    document: SiteConfigQuery['siteConfig'];
    siteConfig: SiteConfig;
  }> {
    const result = await requestWithMetadata(
      client.queries.siteConfig({ relativePath: 'site-config.json' })
    );
    const document = result.data.siteConfig;

    const normalizePublicPath = (value: string): string => {
      if (!value) return value;
      if (value.startsWith('http://') || value.startsWith('https://')) return value;
      return value.startsWith('/') ? value : `/${value}`;
    };

    const socialLinks = (document.socialLinks ?? []).map((link, idx) => {
      validatePath(link?.url ?? '', `socialLinks.${idx}.url`);
      const iconNormalized = normalizePublicPath(link?.icon ?? '');
      validatePath(iconNormalized, `socialLinks.${idx}.icon`);
      return {
        name: link?.name ?? '',
        url: link?.url ?? '',
        icon: iconNormalized,
        inHeader: !!link?.inHeader,
        _index: idx,
      };
    });

    const mainNavigation = (document.navigation?.main ?? []).map((item, idx) => {
      validatePath(item?.url ?? '', `navigation.main.${idx}.url`);
      return {
        title: item?.title ?? '',
        url: item?.url ?? '',
      };
    });

    const ctaNavigation = {
      title: document.navigation?.cta?.title ?? '',
      url: document.navigation?.cta?.url ?? '',
    };
    validatePath(ctaNavigation.url, 'navigation.cta.url');

    const calendarConfig = {
      lumaCalendarId: document.calendar?.lumaCalendarId ?? 'cal-lvIwlKjJGAceOBN',
      lumaCalendarSlug: document.calendar?.lumaCalendarSlug ?? 'daisi',
      googleCalendarBackupId: document.calendar?.googleCalendarBackupId ?? 'b7bo0qsj27l7ahfaqgqiavjom9etg7sb@import.calendar.google.com',
    };

    const config: SiteConfig = {
      title: document.title,
      description: document.description,
      email: document.email,
      ogImage: document.ogImage ?? undefined,
      socialLinks,
      navigation: {
        main: mainNavigation,
        cta: ctaNavigation,
      },
      footerTagline: document.footerTagline ?? undefined,
      calendar: calendarConfig,
      url: "https://durhamaisafety.uk",
      lang: "en_GB",
      repository: "DurhamAISafety/durhamaisafety.github.io",
      showEditLink: false,
      googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",
      _source: document,
    };

    return { document, siteConfig: config };
  }
  ```

- [ ] **Step 1.5.2: Commit**
  Run: `rtk git add src/data/config.ts && rtk git commit -m "feat(data): refactor loaders, implement homePage, aboutPage, researchPage queries, and custom custom validation"`

---

### Task 1.6: Page Rewiring
**Goal:** Rewire pages and layouts to consume new loaders and bind proper data-tina-fields.
**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/research.astro`

- [ ] **Step 1.6.1: Update Layout.astro**
  Open `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/layouts/Layout.astro`.
  Find references to `siteConfig.social` (often in JSON-LD) and replace with dynamic lookups.
  Example lookup method:
  ```typescript
  const findSocialUrl = (name: string) =>
    siteConfig.socialLinks.find(s => s.name.toLowerCase() === name.toLowerCase())?.url ?? '';

  const socialShim = {
    instagram: findSocialUrl('instagram'),
    discord: findSocialUrl('discord'),
    linkedin: findSocialUrl('linkedin'),
    linktree: findSocialUrl('linktree'),
  };
  ```
  Replace `siteConfig.social.instagram` with `socialShim.instagram` etc. in Layout.astro.

- [ ] **Step 1.6.2: Update src/pages/about.astro**
  Open `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/pages/about.astro`.
  1. Add loader import: `import { getSiteConfigContent, getAboutPageContent } from '../data/config';`
  2. Query config: `const { aboutConfig } = await getAboutPageContent();`
  3. Replace all instances of `siteConfig.aboutPage` with `aboutConfig`.
  4. Replace `tinaField(siteConfig._source, 'aboutPage.introText')` with `tinaField(aboutConfig._source, 'about.introText')` and similar for all fields (introText, missionCards, impactIcon, impactTitle, impactText, joinTitle, joinText).

- [ ] **Step 1.6.3: Update src/pages/research.astro**
  Open `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/pages/research.astro`.
  1. Import loader: `import { getSiteConfigContent, getResearchPageContent } from "../data/config";`
  2. Query config: `const { researchConfig } = await getResearchPageContent();`
  3. Replace `siteConfig.researchPage` with `researchConfig`.
  4. Replace `tinaField(siteConfig._source, 'researchPage.opportunitiesTitle')` with `tinaField(researchConfig._source, 'research.opportunitiesTitle')` (same for opportunities list, opportunitiesCtaText, areasTitle, researchAreas list).

- [ ] **Step 1.6.4: Update src/pages/index.astro**
  Open `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/pages/index.astro`.
  1. Import loader: `import { getSiteConfigContent, getHomePageContent } from '../data/config';`
  2. Query config: `const { homeConfig } = await getHomePageContent();`
  3. Replace `siteConfig.homepage` with `homeConfig`.
  4. Replace `tinaField(siteConfig._source, 'homepage.heroTitle')` with `tinaField(homeConfig._source, 'home.heroTitle')` (same for all hero, subtitle highlight, main subtitle, cta, eventsTitle, programmesTitle, researchTitle, researchSubtitle, researchViewAllText).

- [ ] **Step 1.6.5: Run check & build**
  Run: `npx astro check`
  Expected: Clean check success.
  Run: `npm run build`
  Expected: Successful production build.

- [ ] **Step 1.6.6: Commit**
  Run: `rtk git add src/layouts/Layout.astro src/pages/ && rtk git commit -m "feat(pages): rewire index, about, research, and layouts to use separate copy loaders"`

---

## Phase 2: Component Extraction & Supporter Unification

### Task 2.1: Supporter Unification
**Goal:** Create unified helper for logo path normalization and a shared logo card/logo component with variants.
**Files:**
- Create: `src/components/SupporterLogo.astro`

- [ ] **Step 2.1.1: Create SupporterLogo.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/SupporterLogo.astro`.
  ```astro
  ---
  export interface Props {
    name: string;
    logo: string;
    link: string;
    subtitle?: string;
    variant: 'hero' | 'grid';
  }

  const { name, logo, link, subtitle, variant } = Astro.props;

  // Normalization helper
  const normalizePath = (p: string) => {
    if (!p) return '';
    if (p.startsWith('/') || p.startsWith('http://') || p.startsWith('https://')) return p;
    return `/${p}`;
  };

  const cleanLogo = normalizePath(logo);
  ---

  {variant === 'hero' ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center justify-center transition-all duration-300 filter grayscale opacity-45 hover:grayscale-0 hover:opacity-100 h-10 px-2"
      title={`${name} ${subtitle ?? ''}`}
    >
      <img src={cleanLogo} alt={`${name} logo`} class="max-h-full max-w-[140px] object-contain" />
    </a>
  ) : (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="research-card rounded-2xl p-6 flex flex-col items-center justify-center card-hover border border-durham-purple/20 transition-all duration-300"
    >
      <div class="h-20 flex items-center justify-center mb-4">
        <img src={cleanLogo} alt={`${name} logo`} class="max-h-full max-w-[180px] object-contain" />
      </div>
      <h4 class="text-lg font-bold text-center">{name}</h4>
      {subtitle && <p class="text-sm text-muted-text text-center mt-1">{subtitle}</p>}
    </a>
  )}
  ```

- [ ] **Step 2.1.2: Commit**
  Run: `rtk git add src/components/SupporterLogo.astro && rtk git commit -m "feat(supporters): create SupporterLogo component with hero and grid layout variants"`

---

### Task 2.2: Modular Component Extraction from index.astro
**Goal:** Deconstruct monolithic index.astro code into modular components.
**Files:**
- Create: `src/components/sections/HeroSection.astro`
- Create: `src/components/sections/EventsSection.astro`
- Create: `src/components/sections/ProgrammePreviewSection.astro`
- Create: `src/components/sections/ResearchPreviewSection.astro`
- Create: `src/components/sections/SupportersSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 2.2.1: Extract HeroSection.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/sections/HeroSection.astro`.
  Cut the hero rendering block (including the dynamic supporters strip, text highlights, primary/secondary buttons) and paste it into this file, preserving all classes, `.reveal` delay classes, and visual editing markers (`data-tina-field`).
  Include supporters rendering through `SupporterLogo` using `variant="hero"`.

- [ ] **Step 2.2.2: Extract EventsSection.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/sections/EventsSection.astro`.
  Cut the Events calendar Section markup, descriptions, backup links, Luma scripts, calendar wrapper, and custom inline stylesheet/iframe definitions from `index.astro` and paste into `EventsSection.astro`.
  Ensure `.cal-icon` styles and local behaviors are preserved perfectly.

- [ ] **Step 2.2.3: Extract ProgrammePreviewSection.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/sections/ProgrammePreviewSection.astro`.
  Cut the dynamic Programmes section rendering (programmesTitle, cards loop, Font Awesome icons) from `index.astro` and paste here.

- [ ] **Step 2.2.4: Extract ResearchPreviewSection.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/sections/ResearchPreviewSection.astro`.
  Cut the Research Publications Section block from `index.astro` and paste here.

- [ ] **Step 2.2.5: Extract SupportersSection.astro**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/src/components/sections/SupportersSection.astro`.
  Cut the bottom supporters grid block from `index.astro` and paste here. Render supporters using `<SupporterLogo ... variant="grid" />`.

- [ ] **Step 2.2.6: Update index.astro**
  Update `src/pages/index.astro` to import and render these five modular section components, feeding the required dynamic copy variables (e.g. `homeConfig`, `supporters`, `programmes`, `research`) as props.
  Ensure all data-tina-island boundary wrappers are kept intact around the component invocations.

- [ ] **Step 2.2.7: Run compile check**
  Run: `npx astro check`
  Expected: Clean compile diagnostics.
  Run: `npm run build`
  Expected: Clean bundle build.

- [ ] **Step 2.2.8: Commit**
  Run: `rtk git add src/components/sections/ src/pages/index.astro && rtk git commit -m "feat(homepage): split index.astro into modular components and wire supporters unification"`

---

## Phase 3: Tooling, Documentation & Cleanup

### Task 3.1: Tooling Configuration
**Goal:** Initialize tsconfig.json conforming to Astro's template.
**Files:**
- Create: `tsconfig.json`

- [ ] **Step 3.1.1: Create tsconfig.json**
  Create `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/tsconfig.json` with standard Astro strict setup:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@components/*": ["src/components/*"],
        "@layouts/*": ["src/layouts/*"],
        "@data/*": ["src/data/*"]
      }
    }
  }
  ```

- [ ] **Step 3.1.2: Verify check works**
  Run: `npx astro check`
  Expected: Successful compilation without type issues.

- [ ] **Step 3.1.3: Commit**
  Run: `rtk git add tsconfig.json && rtk git commit -m "chore: add standard tsconfig.json configuration"`

---

### Task 3.2: Documentation Updates & Stale Cleanup
**Goal:** Refresh system documentation, clean completed tasks, and run final suite.
**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `TODO.md`

- [ ] **Step 3.2.1: Update README.md**
  Update CMS coverage table in `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/README.md` to document the new `homePage`, `aboutPage`, and `researchPage` collections.

- [ ] **Step 3.2.2: Update AGENTS.md**
  Ensure the lockfile / package manager constraints (npm only, block/avoid accidental pnpm lockfiles/workspaces) and Astro 5 pinning rules are clearly documented.

- [ ] **Step 3.2.3: Trim completed TODO items**
  Trim completed cleanup items from `/Users/Subspace_Explorer/Projects/durhamaisafety.github.io/TODO.md`.

- [ ] **Step 3.2.4: Run checks**
  Run: `git diff --check`
  Expected: No whitespace diagnostics.
  Run: `npx astro check`
  Expected: Pass.
  Run: `npm run build`
  Expected: Pass.

- [ ] **Step 3.2.5: Commit**
  Run: `rtk git add README.md AGENTS.md TODO.md && rtk git commit -m "docs: refresh agents.md, readme, and todo list to match final cleanup state"`
