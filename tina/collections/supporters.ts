import type { Collection } from "tinacms";

export const supportersField = {
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
} satisfies NonNullable<Collection["fields"]>[number];
