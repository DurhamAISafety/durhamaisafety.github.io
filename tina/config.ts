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
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/

  schema: {
    collections: [
      // ── People (Team Members & Alumni) ──────────────────────────────────
      {
        name: "people",
        label: "People",
        path: "src/content",
        format: "yml",
        match: {
          include: "people",
        },
        // Single-file collection — the whole list lives in one YAML file
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

      // ── Site Config (hero text, nav, etc.) ───────────────────────────────
      // This lets editors change the hero heading, description, and nav CTA
      // without touching code. Maps to src/data/config.ts values stored as JSON.
      //
      // To enable: create src/content/site-config.json with your current
      // values from config.ts, then import from there instead.
      // (See migration note in README below)
    ],
  },
});

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SETUP STEPS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. Install Tina:
 *      npx @tinacms/cli@latest init
 *    Skip when it asks to overwrite this config file.
 *
 * 2. Create a project at https://app.tina.io, then add to your .env:
 *      TINA_CLIENT_ID=...
 *      TINA_TOKEN=...
 *
 * 3. Add to .gitignore:
 *      .tina/__generated__
 *
 * 4. Replace your cms-open-pr / cms-auto-merge GitHub Actions with Tina's
 *    built-in branch management — Tina Cloud handles this automatically.
 *    You can delete:
 *      .github/workflows/cms-auto-merge.yml
 *      .github/workflows/cms-open-pr.yml
 *
 * 5. For inline (click-to-edit) hero text, add the `tinaField` helper to
 *    your index.astro hero section. Example:
 *
 *      import { tinaField } from 'tinacms/dist/react';
 *      ...
 *      <h1 data-tina-field={tinaField(data, 'heroHeading')}>
 *        {data.heroHeading}
 *      </h1>
 *
 *    This requires moving hero strings into a content file (not config.ts).
 *    The site-config collection above is a starting point for that.
 *
 * 6. Run locally:
 *      npx tinacms dev -c "astro dev"
 *    Then visit http://localhost:3000/admin to see the editor.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */