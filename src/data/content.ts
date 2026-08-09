import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Reads and parses a content file from `src/content`.
 * Content is read directly from disk at build time (static output), so no CMS
 * runtime or API is involved.
 */
const contentDir = path.join(process.cwd(), 'src', 'content');

export function readYaml<T = any>(relPath: string): T {
  return parseYaml(readFileSync(path.join(contentDir, relPath), 'utf-8')) as T;
}

export function readJson<T = any>(relPath: string): T {
  return JSON.parse(readFileSync(path.join(contentDir, relPath), 'utf-8')) as T;
}
