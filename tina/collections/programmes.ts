import type { Collection } from "tinacms";

export const programmesCollection: Collection = {
  name: "programmes",
  label: "Programmes Page",
  path: "src/content",
  format: "yml",
  match: {
    include: "programmes",
  },
  ui: {
    router: () => "/programmes/",
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
};
