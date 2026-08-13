import { readYaml } from './content';

export interface ProgrammeTag {
  icon: string;
  label: string;
}

export interface WhosThisFor {
  icon?: string;
  text: string;
}

export interface FeatureBoxItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
  link_label?: string;
}

export interface FeatureBoxes {
  heading?: string;
  items: FeatureBoxItem[];
}

export interface Programme {
  title: string;
  icon: string;
  image?: string;
  short_description: string;
  long_description?: string;
  tags?: ProgrammeTag[];
  whos_this_for?: WhosThisFor[];
  feature_boxes?: FeatureBoxes;
  cta?: 'email' | 'community'; // 'email' = direct contact; default 'community' (news + calendar)
}

export async function getProgrammesContent(): Promise<{ programmes: Programme[] }> {
  const { programmes = [] } = readYaml<{ programmes: Programme[] }>('programmes.yml');
  return { programmes };
}

/**
 * Renders inline Markdown to HTML — **bold**, _italic_, [label](url) — with no
 * paragraph wrapping, so it is safe to drop inside an existing <h1>/<p>.
 * External (http/https) links open in a new tab; internal (/, #, mailto:) don't.
 */
export function renderInlineMarkdown(input: string): string {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic _text_
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Links [label](url) — url may be http(s), or an internal /, #, or mailto: target.
    // Quote/angle chars are excluded from the url and the remaining "/' are escaped
    // for attribute context, so a url can't break out of the href attribute.
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)"'<>]+|(?:mailto:|[/#])[^\s)"'<>]*)\)/g,
      (_match, label: string, url: string) => {
        const external = /^https?:\/\//.test(url);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        const safeUrl = url.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        return `<a href="${safeUrl}" class="text-durham-purple hover:text-bright-purple underline transition-colors"${attrs}>${label}</a>`;
      }
    );
}

/**
 * Renders a small subset of Markdown to HTML.
 * Supports: paragraphs, **bold**, _italic_, [link](url)
 */
export function renderMarkdown(input: string): string {
  if (!input) return '';

  return input
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p class="text-lg leading-relaxed mb-4 last:mb-0">${renderInlineMarkdown(p).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

/**
 * Generates a URL-safe anchor slug from a programme title.
 * e.g. "In-Depth Reading Groups" → "reading-groups"
 * Matches the id attributes used in programmes.astro.
 */
export function programmeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
