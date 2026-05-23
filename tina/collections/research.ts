import type { Collection } from "tinacms";

export const papersField = {
  type: "object",
  name: "papers",
  label: "Research Papers",
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
} satisfies NonNullable<Collection["fields"]>[number];
