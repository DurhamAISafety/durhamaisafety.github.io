import type { Collection } from "tinacms";

export const siteConfigCollection: Collection = {
  name: "siteConfig",
  label: "Site Config",
  path: "src/content",
  format: "json",
  match: {
    include: "site-config",
  },
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    // ── Basic info ───────────────────────────────────────────────────
    {
      type: "string",
      name: "title",
      label: "Site Title",
      required: true,
      ui: {
        description: "Used in the browser tab, OG tags, and the footer brand name.",
      },
    },
    {
      type: "string",
      name: "description",
      label: "Site Description",
      required: true,
      ui: {
        component: "textarea",
        description: "Default meta description used when a page doesn't provide its own.",
      },
    },
    {
      type: "string",
      name: "email",
      label: "Contact Email",
      required: true,
      ui: {
        description: "Shown in the footer and used for mailto links.",
      },
    },
    {
      type: "image",
      name: "ogImage",
      label: "Default OG Image",
      required: false,
      ui: {
        description: "Fallback social-sharing image (1200×630px recommended).",
      },
    },

    // ── Social links ─────────────────────────────────────────────────
    {
      type: "object",
      name: "socialLinks",
      label: "Social Links",
      list: true,
      ui: {
        description:
          "All social/external links. Toggle 'Show in header' to surface a link as an icon in the site header (max 4).",
        itemProps: (item) => ({
          label: item?.name
            ? `${item.name}${item.inHeader ? " ✓ header" : ""}`
            : "New Link",
        }),
      },
      fields: [
        {
          type: "string",
          name: "name",
          label: "Name",
          required: true,
          ui: {
            description: 'Display name, e.g. "Discord" or "Instagram".',
          },
        },
        {
          type: "string",
          name: "url",
          label: "URL",
          required: true,
        },
        {
          type: "image",
          name: "icon",
          label: "Icon",
          required: true,
          ui: {
            description:
              "Upload or select an icon image (recommended: public/images/icons/). Use full relative paths like images/icons/discord.svg so Tina can preview the file.",
          },
        },
        {
          type: "boolean",
          name: "inHeader",
          label: "Show in header?",
          required: false,
          ui: {
            description: "Up to 4 links can appear as icons in the desktop/mobile header.",
          },
        },
      ],
    },

    // ── Navigation ───────────────────────────────────────────────────
    {
      type: "object",
      name: "navigation",
      label: "Navigation",
      fields: [
        {
          type: "object",
          name: "main",
          label: "Main Nav Links",
          list: true,
          ui: {
            description: "Links shown in the desktop header and mobile menu. Order matters.",
            itemProps: (item) => ({
              label: item?.title ? `${item.title} → ${item.url}` : "New Link",
            }),
          },
          fields: [
            {
              type: "string",
              name: "title",
              label: "Label",
              required: true,
            },
            {
              type: "string",
              name: "url",
              label: "URL",
              required: true,
              ui: {
                description: 'Internal paths like "/about/" or anchor links like "/#events".',
              },
            },
          ],
        },
        {
          type: "object",
          name: "cta",
          label: "CTA Button",
          ui: {
            description: 'The pill button on the right of the header, e.g. "Get Involved".',
          },
          fields: [
            {
              type: "string",
              name: "title",
              label: "Button Label",
              required: true,
            },
            {
              type: "string",
              name: "url",
              label: "URL",
              required: true,
            },
          ],
        },
      ],
    },

    // ── Footer ───────────────────────────────────────────────────────
    {
      type: "string",
      name: "footerTagline",
      label: "Footer Tagline",
      required: false,
      ui: {
        component: "textarea",
        description: 'Short blurb shown under the email in the footer, e.g. "Questions, suggestions, or want to collaborate? Feel free to reach out!"',
      },
    },

    // ── Calendar Config ───────────────────────────────────────────────
    {
      type: "object",
      name: "calendar",
      label: "Events Calendar Config",
      fields: [
        {
          type: "string",
          name: "lumaCalendarId",
          label: "Luma Calendar ID",
          required: true,
          ui: {
            description: "The Luma calendar ID, e.g., 'cal-lvIwlKjJGAceOBN'",
          },
        },
        {
          type: "string",
          name: "lumaCalendarSlug",
          label: "Luma Calendar URL Slug",
          required: true,
          ui: {
            description: "The slug of the calendar URL, e.g., 'daisi' from luma.com/daisi",
          },
        },
        {
          type: "string",
          name: "googleCalendarBackupId",
          label: "Backup Google Calendar ID",
          required: true,
          ui: {
            description: "The raw calendar ID used for the fallback Google Calendar link",
          },
        },
      ],
    },
  ],
};
