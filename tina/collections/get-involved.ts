import type { Collection } from "tinacms";

export const getInvolvedCollection: Collection = {
  name: "getInvolved",
  label: "Get Involved Cards",
  path: "src/content",
  format: "yml",
  match: {
    include: "get-involved",
  },
  ui: {
    router: () => "/get-involved/",
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
};
