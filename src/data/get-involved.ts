import { readYaml } from './content';

export interface GetInvolvedCard {
  title: string;
  description: string;
  icon: string;
  link_url: string;
  link_label: string;
  external: boolean;
  featured: boolean;
  recommended_label?: string;
}

export async function getGetInvolvedContent(): Promise<{
  cards: GetInvolvedCard[];
  featuredCards: GetInvolvedCard[];
  moreCards: GetInvolvedCard[];
}> {
  const { cards: rawCards = [] } = readYaml<{ cards: GetInvolvedCard[] }>('get-involved.yml');
  const cards = rawCards.map((card) => ({
    title: card.title,
    description: card.description,
    icon: card.icon,
    link_url: card.link_url,
    link_label: card.link_label,
    external: card.external ?? false,
    featured: card.featured ?? false,
    recommended_label: card.recommended_label ?? undefined,
  }));

  return {
    cards,
    featuredCards: cards.filter((card) => card.featured),
    moreCards: cards.filter((card) => !card.featured),
  };
}
