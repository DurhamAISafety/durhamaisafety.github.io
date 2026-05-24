# Production Bug Resolution Notes

This document logs critical production-only bugs, root cause analyses, and their resolutions to assist future maintainers of the DAISI website.

---

## Visual editing fields not appearing in TinaCMS Cloud

**Symptom:** Visual editing works in local dev (`tinacms dev`) but the admin sidebar
shows "TinaCMS form fields will appear here" when using TinaCMS Cloud.

**Cause:** `tinaField(obj, 'field')` returns `""` when `obj` is a spread copy of the
original query result rather than the original object reference. TinaCMS attaches field
path metadata to the specific object reference returned by the client — spreading it into
a new object loses that association.

Local dev doesn't surface this because TinaCMS connects directly to the local GraphQL
server and doesn't rely on `data-tina-field` attributes. Cloud mode uses a client-side
bridge that does, so empty attributes mean no forms are registered.

**Fix:** Pass the original raw query object to `tinaField()`, not a processed copy.

```ts
// config.ts — return the raw document alongside the processed config
return { document: result.data.aboutPage, aboutConfig };
```

```astro
<!-- page.astro — destructure document and use the raw object for tinaField() -->
const { document, aboutConfig } = await getAboutPageContent();
const doc = document.about!;

<!-- Wrong: aboutConfig is a spread copy, tinaField returns "" -->
<p data-tina-field={tinaField(aboutConfig, 'introText')} />

<!-- Correct: doc is the original reference, tinaField works -->
<p data-tina-field={tinaField(doc, 'introText')} />
```

Nested objects (e.g. array items from `compact(doc.missionCards)`) are the same
references as in the original, so `tinaField(card, 'field')` works correctly without
this workaround.