import { defineConfig } from "tinacms";
import { siteConfigCollection } from "./collections/site-config";
import { getInvolvedCollection } from "./collections/get-involved";
import { programmesCollection } from "./collections/programmes";
import { homePageCollection, aboutPageCollection, researchPageCollection } from "./collections/pages";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  // Get this from tina.io
  token: process.env.TINA_TOKEN || null,

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
      // ── Site-wide configuration ──────────────────────────────────────────
      siteConfigCollection,

      // ── Pages ────────────────────────────────────────────────────────────
      homePageCollection,
      aboutPageCollection,
      researchPageCollection,
      programmesCollection,
      getInvolvedCollection,
    ],
  },
});
