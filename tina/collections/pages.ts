import type { Collection } from "tinacms";
import { peopleField } from "./people";
import { papersField } from "./research";
import { supportersField } from "./supporters";

// Tina collection modules are bundled for the browser, so keep schema options
// independent of Node-only filesystem access.
const colorOptions = [
  { label: "Durham Purple", value: "text-durham-purple" },
  { label: "Deep Purple", value: "text-deep-purple" },
  { label: "Bright Purple", value: "text-bright-purple" },
  { label: "Light Purple", value: "text-light-purple" },
  { label: "Lavender", value: "text-lavender" },
  { label: "Ocean Blue", value: "text-ocean-blue" },
  { label: "Navy", value: "text-navy" },
];

// ── Home Page ──────────────────────────────────────────────────────────
export const homePageCollection: Collection = {
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
        supportersField,
      ],
    },
  ],
};

// ── About Page ─────────────────────────────────────────────────────────
export const aboutPageCollection: Collection = {
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
        peopleField,
      ],
    },
  ],
};

// ── Research Page ──────────────────────────────────────────────────────
export const researchPageCollection: Collection = {
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
              options: colorOptions,
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
              options: colorOptions,
            },
            { type: "string", name: "title", label: "Title", required: true },
            { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
            { type: "string", name: "linkUrl", label: "Link URL", required: true },
          ],
        },
        papersField,
      ],
    },
  ],
};
