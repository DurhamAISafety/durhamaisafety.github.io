// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  // Your Tina Cloud project ID — get this from app.tina.io after creating a project
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // ── People (Team Members & Alumni) ──────────────────────────────────
      {
        name: "people",
        label: "People",
        path: "src/content",
        format: "yml",
        match: {
          include: "people"
        },
        // Single-file collection — the whole list lives in one YAML file
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "people",
            label: "People",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name ? `[${item.type ?? "?"}] ${item.name} \u2014 ${item.role ?? ""}` : "New Person"
              })
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true
              },
              {
                type: "string",
                name: "type",
                label: "Type",
                required: true,
                options: [
                  { label: "Team Member", value: "member" },
                  { label: "Alumnus", value: "alumnus" }
                ]
              },
              {
                type: "string",
                name: "role",
                label: "Role",
                required: true
              },
              {
                type: "number",
                name: "start_year",
                label: "Start Year",
                required: false,
                ui: {
                  description: "Team members: year they joined (shows as 2024\u2013present)"
                }
              },
              {
                type: "string",
                name: "years_active",
                label: "Years Active",
                required: false,
                ui: {
                  description: 'Alumni: e.g. "2023-2024"'
                }
              },
              {
                type: "image",
                name: "photo",
                label: "Photo",
                required: false
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
                required: false
              },
              {
                type: "string",
                name: "durham_staff_link",
                nameOverride: "durham-staff-link",
                label: "Durham Staff Link",
                required: false
              },
              {
                type: "string",
                name: "link",
                label: "Personal Website",
                required: false
              }
            ]
          }
        ]
      },
      // ── Research Papers ──────────────────────────────────────────────────
      {
        name: "research",
        label: "Research Papers",
        path: "src/content",
        format: "yml",
        match: {
          include: "research"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "papers",
            label: "Papers",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title ? `${item.title} (${item.year ?? "?"})` : "New Paper"
              })
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true
              },
              {
                type: "string",
                name: "url",
                label: "URL",
                required: true
              },
              {
                type: "image",
                name: "thumbnail",
                label: "Thumbnail",
                required: false,
                ui: {
                  description: "Screenshot the PDF first page and upload here. Stored in src/assets/research/"
                }
              },
              {
                type: "object",
                name: "authors",
                label: "Authors",
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.name ?? "Author" })
                },
                fields: [
                  {
                    type: "string",
                    name: "name",
                    label: "Name",
                    required: true,
                    ui: { description: 'Format: "Surname, F."' }
                  },
                  {
                    type: "boolean",
                    name: "team",
                    label: "DAISI Member?",
                    required: false,
                    ui: {
                      description: "Bold this name as a DAISI team member"
                    }
                  }
                ]
              },
              {
                type: "number",
                name: "year",
                label: "Year",
                required: true
              },
              {
                type: "number",
                name: "month",
                label: "Month (1\u201312)",
                required: false,
                ui: { description: "Used for ordering within a year" }
              },
              {
                type: "string",
                name: "venue",
                label: "Venue",
                required: true,
                ui: { description: 'Short venue name, e.g. "ICML 2025"' }
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
                ui: { description: "e.g. Interpretability, Governance" }
              },
              {
                type: "string",
                name: "type",
                label: "Type",
                required: true,
                options: [
                  { label: "Academic", value: "academic" },
                  { label: "Non-Academic", value: "non-academic" }
                ]
              }
            ]
          }
        ]
      },
      // ── Supporters ───────────────────────────────────────────────────────
      {
        name: "supporters",
        label: "Supporters",
        path: "src/content",
        format: "yml",
        match: {
          include: "supporters"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "supporters",
            label: "Supporters",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name ?? "Supporter" })
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true
              },
              {
                type: "string",
                name: "logo",
                label: "Logo Filename",
                required: true,
                ui: {
                  description: 'Filename in public/images/supporters/ e.g. "logo.png"'
                }
              },
              {
                type: "string",
                name: "link",
                label: "Link",
                required: true
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                required: false,
                ui: { description: 'e.g. "(fmr. Open Philanthropy)"' }
              }
            ]
          }
        ]
      }
      // ── Site Config (hero text, nav, etc.) ───────────────────────────────
      // This lets editors change the hero heading, description, and nav CTA
      // without touching code. Maps to src/data/config.ts values stored as JSON.
      //
      // To enable: create src/content/site-config.json with your current
      // values from config.ts, then import from there instead.
      // (See migration note in README below)
    ]
  }
});
export {
  config_default as default
};
