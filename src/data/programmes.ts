import { parse } from 'yaml';

export interface ProgrammeTag {
  icon: string;
  label: string;
}

export interface WhosThisFor {
  icon: string;
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
  short_description: string;
  long_description?: string;
  tags?: ProgrammeTag[];
  whos_this_for?: WhosThisFor[];
  feature_boxes?: FeatureBoxes;
}

import programmesYaml from '../content/programmes.yml?raw';

export const programmes: Programme[] = (
  parse(programmesYaml) as { programmes: Programme[] }
).programmes;

/**
 * Renders a small subset of Markdown to HTML.
 * Supports: paragraphs, **bold**, _italic_, [link](url)
 * This runs at build time only — no client-side JS needed.
 */
export function renderMarkdown(input: string): string {
  if (!input) return '';

  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Split into paragraphs on blank lines
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const renderInline = (text: string): string =>
    text
      // Bold **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic _text_
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Links [label](url)
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
        '<a href="$2" class="text-durham-purple hover:text-bright-purple underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Line breaks within a paragraph
      .replace(/\n/g, '<br>');

  return paragraphs
    .map(p => `<p class="text-lg leading-relaxed mb-4 last:mb-0">${renderInline(p)}</p>`)
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