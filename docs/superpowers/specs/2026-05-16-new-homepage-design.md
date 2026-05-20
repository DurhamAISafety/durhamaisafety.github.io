# New Homepage Design

## Goal

Create an experimental homepage at `/new-homepage/` that makes DAISI feel serious, research-led, and clearly rooted in Durham, without changing the live homepage at `/`.

The page should attract staff, graduate researchers, and talented students across STEM, politics, philosophy, economics, and adjacent fields. It should clearly state DAISI's focus on catastrophic risks from advanced AI, while remaining welcoming to people who are curious, sceptical, or entering through nearer-term AI risk and governance concerns.

## Positioning

The homepage should use a broad disciplinary appeal with an institutional and research-facing tilt. It should avoid the current AI-generated cues: glowing purple gradients, glassy rounded cards, large generic icons, centred decorative section headings, and startup-style hero treatment.

The new direction should keep Durham purple, but use it more like an institutional colour: typography accents, rules, borders, labels, buttons, and section markers. The base palette should be white or off-white with disciplined purple contrast. Durham Cathedral should remain prominent as the visual anchor for place and credibility, but should not sit under a heavy dark overlay.

## Route And Scope

- Add a new Astro route at `src/pages/new-homepage.astro`.
- Do not edit `src/pages/index.astro`.
- Do not add `/new-homepage/` to the site navigation.
- Reuse existing layout, header, footer, data loaders, images, and Tina content where practical.
- Keep the page buildable through the existing Astro/Tina production path.

## Content And Tina CMS

The page should preserve and extend visual editing where it matters:

- Continue loading Programmes, Research, and Supporters through `src/data/*.ts`.
- Preserve Tina source objects on rendered editable content so components can use `tinaField(...)`.
- Use existing Tina islands where the redesigned page can reuse them cleanly.
- If new homepage-only copy becomes editable, add it through a dedicated content file, schema entry, loader, and island registry entry instead of hardcoding long-lived copy.
- Short experimental labels and structural headings can be static for this first route if they are clearly design scaffolding.

## Page Structure

1. Hero
   - Clean white/off-white layout with a prominent Durham Cathedral image.
   - Lead with the DAISI name and a direct catastrophic-risk positioning line.
   - Include restrained CTAs for getting involved, exploring research, and seeing events.
   - Include one short line that welcomes newcomers and sceptics without diluting the catastrophic-risk focus.

2. Research Signal
   - Move research credibility near the top of the page.
   - Show recent research/projects using existing research content.
   - Avoid carousel-first dependence if a static editorial layout communicates seriousness better.

3. Audience Pathways
   - Present clear routes for students, researchers/staff, and newcomers/sceptics.
   - Use compact editorial panels rather than icon-heavy cards.
   - Explain the value proposition for each audience in concrete terms.

4. What DAISI Runs
   - Present events, programmes, reading groups, and research support using existing programme content.
   - Style this like a prospectus or research group activity list, not a grid of generic feature cards.

5. Events
   - Keep the calendar functionality.
   - Make the calendar section operational and readable, not the dominant brand moment.

6. Supporters
   - Keep supporters as a quiet credibility strip or closing section.

## Visual System

- Base: white/off-white surfaces, high contrast body text, Durham purple accents.
- Typography: use Merriweather for h1/h2 display headings and major section titles, paired with IBM Plex Sans for body text and UI chrome. Keep Merriweather deliberate rather than ubiquitous: avoid it for compact labels, buttons, cards, navigation, and dense mobile text where its weight can feel heavy. Avoid oversized hero text inside compact areas.
- Components: reduce glassmorphism, broad gradients, pill overload, decorative rounded cards, and large Font Awesome icon blocks.
- Layout: use section rules, columns, labels, and structured editorial groups. Keep generous spacing without making the page feel like a SaaS landing page.
- Motion: preserve existing reveal behaviour only where it feels subtle and useful.
- Accessibility: maintain semantic headings, readable contrast, visible focus states, and responsive text that does not overlap.

## Validation

Baseline checks:

- `npx astro check`
- `npm run build`

Manual checks:

- Visit `/new-homepage/`.
- Confirm `/` still renders the current homepage.
- Confirm `/new-homepage/` is not linked from header navigation.
- Check desktop and mobile layouts for text overlap, image cropping, and CTA wrapping.
- Confirm Tina-editable content still renders with appropriate source-backed fields where reused.
