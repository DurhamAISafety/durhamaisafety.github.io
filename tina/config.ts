import { defineConfig } from "tinacms";
import { siteConfigCollection } from "./collections/site-config";
import { peopleCollection } from "./collections/people";
import { researchCollection } from "./collections/research";
import { supportersCollection } from "./collections/supporters";
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
      // ── People (Team Members & Alumni) - FIRST in list ────────────────────
      peopleCollection,

      // ── Site Config (header, footer, navigation) ─────────────────────────
      siteConfigCollection,

      // ── Research Papers ──────────────────────────────────────────────────
      researchCollection,

      // ── Supporters ───────────────────────────────────────────────────────
      supportersCollection,

      // ── Get Involved Cards ───────────────────────────────────────────────
      getInvolvedCollection,

      // ── Programmes ───────────────────────────────────────────────────────
      programmesCollection,

      // ── Page Collections ──────────────────────────────────────────────────
      homePageCollection,
      aboutPageCollection,
      researchPageCollection,
    ],
  },
});
