import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  GetInvolvedCards,
  GetInvolvedQuery,
} from '../../tina/__generated__/types';

export interface GetInvolvedCard {
  title: string;
  description: string;
  icon: string;
  link_url: string;
  link_label: string;
  external: boolean;
  featured: boolean;
  recommended_label?: string;
  _source: GetInvolvedCards;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getGetInvolvedContent(): Promise<{
  document: GetInvolvedQuery['getInvolved'];
  cards: GetInvolvedCard[];
  featuredCards: GetInvolvedCard[];
  moreCards: GetInvolvedCard[];
}> {
  const result = await requestWithMetadata(
    client.queries.getInvolved({ relativePath: 'get-involved.yml' })
  );

  const document = result.data.getInvolved;
  const cards = compact(document.cards).map((card) => ({
    title: card.title,
    description: card.description,
    icon: card.icon,
    link_url: card.link_url,
    link_label: card.link_label,
    external: card.external ?? false,
    featured: card.featured ?? false,
    recommended_label: card.recommended_label ?? undefined,
    _source: card,
  }));

  return {
    document,
    cards,
    featuredCards: cards.filter((card) => card.featured),
    moreCards: cards.filter((card) => !card.featured),
  };
}
