import type { Collection } from "tinacms";

export const supportersCollection: Collection = {
  name: "supporters",
  label: "Supporters",
  path: "src/content",
  format: "yml",
  match: {
    include: "supporters",
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
      name: "supporters",
      label: "Supporters",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.link
            ? item.link.replace(/^https?:\/\/(www\.)?/, "")
            : "Supporter",
        }),
      },
      fields: [
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
      ],
    },
  ],
};
