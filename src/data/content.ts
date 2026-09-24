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
  try {
    return parseYaml(readFileSync(path.join(contentDir, relPath), 'utf-8')) as T;
  } catch (e) {
    throw new Error(`Failed to read content file "src/content/${relPath}": ${(e as Error).message}`, {
      cause: e,
    });
  }
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
