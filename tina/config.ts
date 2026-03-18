import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Site Config (header, footer, navigation) ─────────────────────────
      {
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
        ],
      },

      // ── People (Team Members & Alumni) ──────────────────────────────────
      {
        name: "people",
        label: "People",
        path: "src/content",
        format: "yml",
        match: {
          include: "people",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "people",
            label: "People",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name
                  ? `[${item.type ?? "?"}] ${item.name} — ${item.role ?? ""}`
                  : "New Person",
              }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "type",
                label: "Type",
                required: true,
                options: [
                  { label: "Team Member", value: "member" },
                  { label: "Alumnus", value: "alumnus" },
                ],
              },
              {
                type: "string",
                name: "role",
                label: "Role",
                required: true,
              },
              {
                type: "number",
                name: "start_year",
                label: "Start Year",
                required: false,
                ui: {
                  description:
                    "Team members: year they joined (shows as 2024–present)",
                },
              },
              {
                type: "string",
                name: "years_active",
                label: "Years Active",
                required: false,
                ui: {
                  description: 'Alumni: e.g. "2023-2024"',
                },
              },
              {
                type: "image",
                name: "photo",
                label: "Photo",
                required: false,
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
                required: false,
              },
              {
                type: "string",
                name: "durham_staff_link",
                nameOverride: "durham-staff-link",
                label: "Durham Staff Link",
                required: false,
              },
              {
                type: "string",
                name: "link",
                label: "Personal Website",
                required: false,
              },
            ],
          },
        ],
      },

      // ── Research Papers ──────────────────────────────────────────────────
      {
        name: "research",
        label: "Research Papers",
        path: "src/content",
        format: "yml",
        match: {
          include: "research",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "papers",
            label: "Papers",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title
                  ? `${item.title} (${item.year ?? "?"})`
                  : "New Paper",
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "url",
                label: "URL",
                required: true,
              },
              {
                type: "image",
                name: "thumbnail",
                label: "Thumbnail",
                required: false,
                ui: {
                  description:
                    "Screenshot the PDF first page and upload here. Stored in public/images/research/",
                },
              },
              {
                type: "object",
                name: "authors",
                label: "Authors",
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.name ?? "Author" }),
                },
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Name",
                    required: true,
                    ui: { description: 'Format: "Surname, F."' },
                  },
                  {
                    type: "boolean",
                    name: "team",
                    label: "DAISI Member?",
                    required: false,
                    ui: {
                      description: "Bold this name as a DAISI team member",
                    },
                  },
                ],
              },
              {
                type: "number",
                name: "year",
                label: "Year",
                required: true,
              },
              {
                type: "number",
                name: "month",
                label: "Month (1–12)",
                required: false,
                ui: { description: "Used for ordering within a year" },
              },
              {
                type: "string",
                name: "venue",
                label: "Venue",
                required: true,
                ui: { description: 'Short venue name, e.g. "ICML 2025"' },
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                ui: { description: "e.g. Interpretability, Governance" },
              },
              {
                type: "string",
                name: "type",
                label: "Type",
                required: true,
                options: [
                  { label: "Academic", value: "academic" },
                  { label: "Non-Academic", value: "non-academic" },
                ],
              },
            ],
          },
        ],
      },

      // ── Supporters ───────────────────────────────────────────────────────
      {
        name: "supporters",
        label: "Supporters",
        path: "src/content",
        format: "yml",
        match: {
          include: "supporters",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "supporters",
            label: "Supporters",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name ?? "Supporter" }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "image",
                name: "logo",
                label: "Logo",
                required: true,
                ui: {
                  description:
                    "Upload to public/images/supporters/ (or pick an existing file).",
                },
              },
              {
                type: "string",
                name: "link",
                label: "Link",
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                required: false,
                ui: { description: 'e.g. "(fmr. Open Philanthropy)"' },
              },
            ],
          },
        ],
      },

      // ── Get Involved Cards ───────────────────────────────────────────────
      {
        name: "getInvolved",
        label: "Get Involved Cards",
        path: "src/content",
        format: "yml",
        match: {
          include: "get-involved",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "cards",
            label: "Cards",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title
                  ? `[${item.featured ? "Featured" : "More"}] ${item.title}`
                  : "New Card",
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "icon",
                label: "Icon",
                required: true,
                ui: {
                  description:
                    'Font Awesome class, e.g. "fas fa-calendar-alt" or "fab fa-discord". Browse at fontawesome.com/icons',
                },
              },
              {
                type: "string",
                name: "link_url",
                label: "Link URL",
                required: true,
              },
              {
                type: "string",
                name: "link_label",
                label: "Link Button Text",
                required: true,
              },
              {
                type: "boolean",
                name: "external",
                label: "Open in new tab?",
                required: false,
                ui: {
                  description: "Enable for external links (adds target=_blank)",
                },
              },
              {
                type: "boolean",
                name: "featured",
                label: "Featured (Recommended)?",
                required: false,
                ui: {
                  description:
                    "Featured cards appear in the top highlighted row. Non-featured appear in the 'More Ways' section below.",
                },
              },
              {
                type: "string",
                name: "recommended_label",
                label: "Recommended Label",
                required: false,
                ui: {
                  description:
                    'Optional label shown on featured cards, e.g. "✨ Recommended". Leave blank to hide.',
                },
              },
            ],
          },
        ],
      },

      // ── Programmes ───────────────────────────────────────────────────────
      {
        name: "programmes",
        label: "Programmes",
        path: "src/content",
        format: "yml",
        match: {
          include: "programmes",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "programmes",
            label: "Programmes",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title ?? "New Programme",
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "icon",
                label: "Icon",
                required: true,
                ui: {
                  description:
                    'Font Awesome class, e.g. "fas fa-book-open". Browse icons at fontawesome.com/icons',
                },
              },
              {
                type: "string",
                name: "short_description",
                label: "Short Description",
                required: true,
                ui: {
                  component: "textarea",
                  description: "Shown on the homepage programme card. Keep it to 1–2 sentences.",
                },
              },
              {
                type: "string",
                name: "long_description",
                label: "Long Description (Overview)",
                required: false,
                ui: {
                  component: "textarea",
                  description:
                    "Shown on the Programmes page. Supports basic Markdown: **bold**, _italic_, [link text](https://url.com), and blank lines for paragraph breaks.",
                },
              },
              {
                type: "object",
                name: "tags",
                label: "Tags",
                list: true,
                ui: {
                  description: "Up to 3 tags shown on the homepage card.",
                  max: 3,
                  itemProps: (item) => ({ label: item?.label ?? "Tag" }),
                },
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    required: true,
                    ui: {
                      description:
                        'Font Awesome class without "fas", e.g. "fa-users" or "fa-laptop-code"',
                    },
                  },
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                    ui: {
                      description: 'e.g. "No technical background needed"',
                    },
                  },
                ],
              },
              {
                type: "object",
                name: "whos_this_for",
                label: "Who's This For?",
                list: true,
                ui: {
                  description:
                    "Bullet points shown on the Programmes page in the right-hand column.",
                  itemProps: (item) => ({
                    label: item?.text
                      ? item.text.slice(0, 60) + (item.text.length > 60 ? "…" : "")
                      : "Bullet",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    required: false,
                    ui: {
                      description:
                        'Font Awesome class, e.g. "fas fa-graduation-cap". Defaults to "fas fa-check" if left blank.',
                    },
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                    required: true,
                    ui: {
                      component: "textarea",
                    },
                  },
                ],
              },
              {
                type: "object",
                name: "feature_boxes",
                label: "Feature Boxes",
                ui: {
                  description:
                    "Optional coloured grid shown below the two-column section. Max 3 boxes. Leave empty to hide.",
                },
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Section Heading",
                    required: false,
                    ui: {
                      description:
                        'e.g. "Resources", "Previous Topics", "Previously We\'ve Done". Leave blank for no heading.',
                    },
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Boxes",
                    list: true,
                    ui: {
                      max: 3,
                      itemProps: (item) => ({ label: item?.title ?? "Box" }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon",
                        required: true,
                        ui: {
                          description: 'Font Awesome class, e.g. "fas fa-utensils"',
                        },
                      },
                      {
                        type: "string",
                        name: "title",
                        label: "Title",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                          component: "textarea",
                        },
                      },
                      {
                        type: "string",
                        name: "link",
                        label: "Link URL",
                        required: false,
                      },
                      {
                        type: "string",
                        name: "link_label",
                        label: "Link Label",
                        required: false,
                        ui: {
                          description:
                            'Button text, e.g. "Dissertation support PDF". Defaults to "Learn more" if blank.',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});