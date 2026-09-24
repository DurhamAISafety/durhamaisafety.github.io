import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Reads and parses a content file from `src/content`.
 * Content is read directly from disk at build time (static output), so no CMS
 * runtime or API is involved.
 */
const contentDir = path.join(process.cwd(), 'src', 'content');

export function readYaml<T>(relPath: string): T {
  let data: unknown;
  try {
    data = parseYaml(readFileSync(path.join(contentDir, relPath), 'utf-8'));
  } catch (e) {
    throw new Error(`Failed to read content file "src/content/${relPath}": ${(e as Error).message}`, {
      cause: e,
    });
  }
  return resolveSocialLinks(data, relPath) as T;
}

/**
 * Social links live once, in `socialLinks` (and `email`) in site-config.json. YAML content
 * refers to them as `social:<name>` (lower-case name, e.g. `social:discord`, `social:email`),
 * as a whole link field or inside a Markdown link, and they are swapped in here at build
 * time. An unknown name fails the build rather than shipping a dead link.
 */
let socialLinkMap: Map<string, string> | undefined;

function resolveSocialLinks(value: unknown, relPath: string): unknown {
  if (typeof value === 'string') {
    return value.replace(/\bsocial:([a-z0-9-]+)/g, (_m, name: string) => {
      socialLinkMap ??= buildSocialLinkMap();
      const url = socialLinkMap.get(name);
      if (!url) {
        throw new Error(
          `src/content/${relPath}: unknown link "social:${name}". Use one of ${[...socialLinkMap.keys()].map((k) => `social:${k}`).join(', ')}, or add it to socialLinks in src/content/site-config.json.`
        );
      }
      return url;
    });
  }
  if (Array.isArray(value)) return value.map((v) => resolveSocialLinks(v, relPath));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveSocialLinks(v, relPath)]));
  }
  return value;
}

function buildSocialLinkMap(): Map<string, string> {
  const { email, socialLinks } = readJson<{ email: string; socialLinks: { name: string; url: string }[] }>('site-config.json');
  return new Map([
    ['email', `mailto:${email}`],
    ...socialLinks.map((s): [string, string] => [s.name.toLowerCase(), s.url]),
  ]);
}

export function readJson<T>(relPath: string): T {
  try {
    return JSON.parse(readFileSync(path.join(contentDir, relPath), 'utf-8')) as T;
  } catch (e) {
    throw new Error(`Failed to read content file "src/content/${relPath}": ${(e as Error).message}`, {
      cause: e,
    });
  }
}

/**
 * Serialises structured data for a <script type="application/ld+json"> via set:html.
 * JSON.stringify leaves `<` alone, so CMS text containing `</script>` could close the
 * tag and inject markup; escaping `<` as \u003c keeps the JSON valid and inert.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
