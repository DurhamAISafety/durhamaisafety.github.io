import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  ProgrammesProgrammesFeature_Boxes,
  ProgrammesProgrammesFeature_BoxesItems,
  ProgrammesProgrammesTags,
  ProgrammesProgrammesWhos_This_For,
  ProgrammesQuery,
} from '../../tina/__generated__/types';

export interface ProgrammeTag {
  icon: string;
  label: string;
  _source: ProgrammesProgrammesTags;
}

export interface WhosThisFor {
  icon?: string;
  text: string;
  _source: ProgrammesProgrammesWhos_This_For;
}

export interface FeatureBoxItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
  link_label?: string;
  _source: ProgrammesProgrammesFeature_BoxesItems;
}

export interface FeatureBoxes {
  heading?: string;
  items: FeatureBoxItem[];
  _source: ProgrammesProgrammesFeature_Boxes;
}

export interface Programme {
  title: string;
  icon: string;
  short_description: string;
  long_description?: string;
  tags?: ProgrammeTag[];
  whos_this_for?: WhosThisFor[];
  feature_boxes?: FeatureBoxes;
  _source: ProgrammeSource;
}

export type ProgrammeSource = NonNullable<
  NonNullable<ProgrammesQuery['programmes']['programmes']>[number]
>;

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getProgrammesContent(): Promise<{
  document: ProgrammesQuery['programmes'];
  programmes: Programme[];
}> {
  const result = await requestWithMetadata(
    client.queries.programmes({ relativePath: 'programmes.yml' })
  );

  const document = result.data.programmes;
  const programmes = compact(document.programmes).map((programme) => ({
    title: programme.title,
    icon: programme.icon,
    short_description: programme.short_description,
    long_description: programme.long_description ?? undefined,
    tags: compact(programme.tags).map((tag) => ({
      icon: tag.icon,
      label: tag.label,
      _source: tag,
    })),
    whos_this_for: compact(programme.whos_this_for).map((item) => ({
      icon: item.icon ?? undefined,
      text: item.text,
      _source: item,
    })),
    feature_boxes: programme.feature_boxes
      ? {
          heading: programme.feature_boxes.heading ?? undefined,
          items: compact(programme.feature_boxes.items).map((item) => ({
            icon: item.icon,
            title: item.title,
            description: item.description,
            link: item.link ?? undefined,
            link_label: item.link_label ?? undefined,
            _source: item,
          })),
          _source: programme.feature_boxes,
        }
      : undefined,
    _source: programme,
  }));

  return { document, programmes };
}

/**
 * Renders a small subset of Markdown to HTML.
 * Supports: paragraphs, **bold**, _italic_, [link](url)
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
