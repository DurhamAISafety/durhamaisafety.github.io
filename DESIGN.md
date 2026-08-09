# DAISI — design direction

Companion to `PLAN.md`. The visual identity we're building toward. Human copy is
preserved throughout (see PLAN constraints); this is palette / type / layout only.

## Thesis
Durham identity in the **structure**, people in the **content**. The current site is a
dark neon-purple gradient (generic-AI look, flagged in `TODO.md`). We invert it: a light
**paper** base, palatinate purple as ink & anchor, warmth supplied by photos of people —
not by a glow. Reads like a well-set reading essay (rigour → talent) that's warm and
welcoming (freshers). References: eadurham (clarity) + compsoc (personality); *not* the
lovable mock (start-uppy).

## Colour — palatinate as ink, not background
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F7F5F9` | page base — faint lilac paper (deliberately *not* AI-cream #F4F1EA) |
| `--paper-raised` | `#FFFFFF` | cards |
| `--ink` | `#1E1522` | text — warm near-black aubergine, never pure black |
| `--palatinate` | `#68246D` | primary — Durham official; headings accents, links |
| `--palatinate-deep` | `#39144F` | footer / dark bands |
| `--stone` | `#E8E2EC` | hairlines, dividers, card edges (cathedral-stone lilac-grey) |
| `--gilt` | `#B6862C` | **rare signal only** — live-event dot, one underline. Stained-glass gilt. |

Retire neon `#EB80FD` from primary UI. Dark mode kept but re-derived from these.
**Risk being taken:** purple + gold reads heraldic/generic-university if overused — so gilt
stays desaturated and appears only as a dot/hairline; photos carry the warmth.

## Type — the trio encodes the two audiences
- **Display / headings — Fraunces** (variable serif, high optical size, low softness):
  Durham serif heritage + warmth. Replaces default Merriweather.
- **Body / UI — IBM Plex Sans**: clean, faintly engineered clarity (freshers). Replaces Raleway.
- **Data / eyebrows / metadata — IBM Plex Mono**: precision, technical signal (talent).
- Lower-risk fallback: keep Merriweather for display if Fraunces feels off in situ.

## Signature — the Norman round-arch
Durham Cathedral's defining Romanesque form (round-topped, *not* generic Gothic points).
A thin palatinate hairline arch frames the hero people-photo, echoed faintly as card-tops /
section dividers. Ties "clearly Durham" to structure while content stays people-first —
resolving "Durham identity clear, but not a generic Durham group". Bold once (hero),
hairline-only elsewhere. No 01/02/03 numbering — "what we do" isn't a sequence; use mono eyebrows.

## Hero wireframe
```
┌───────────────────────────────────────────────┐
│  DAISI            About  Events  Research  ↗   │  paper, ink nav, mono
│                                                 │
│  ‹mono eyebrow›              ╭──────────────╮   │  ← round-arch frame
│  Durham students & academics │   people      │   │    (palatinate hairline)
│  for reducing catastrophic   │   photo:      │   │
│  risks from advanced AI      │   a talk /    │   │
│  ‹Fraunces serif, existing›  │   presenting  │   │
│                              ╰──────────────╯   │
│  [ Get Involved ]  About →                      │
└───────────────────────────────────────────────┘
```
Below hero: quiet 2-col band — 1 para "what is AI safety" (existing copy) + embedded video,
editorial like eadurham. Events = Luma + mono metadata. Research = publications list
(serif titles + mono metadata). Photos: pizza→community, freshers→About/Get-Involved,
talks/presenting→hero/Research.

## Links / assets (don't lose)
- Intro video (Home, like eadurham): https://www.youtube.com/watch?v=5KVDDfAkRgc
- "Find out more" link: https://80000hours.org/problem-profiles/risks-from-power-seeking-ai/
- Style refs: https://eadurham-test.netlify.app/ · https://compsoc.tech/
- Branding guide: EA Forum "Branding AI Safety Groups: A Field Guide"
- Anti-example (too start-uppy): https://daisiv2.lovable.app/
