import type { Collection } from "tinacms";

export const peopleCollection: Collection = {
  name: "people",
  label: "People",
  path: "src/content",
  format: "yml",
  match: {
    include: "people",
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
        {
          type: "string",
          name: "description",
          label: "Description",
          required: false,
          ui: {
            description: "1-2 sentence description. Defaults to 'Member of DAISI ...' if blank.",
          },
        },
      ],
    },
  ],
};
