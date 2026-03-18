import { parse } from 'yaml';

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

// Import YAML as raw text using Vite's ?raw suffix
import getInvolvedYaml from '../content/get-involved.yml?raw';

export const cards: GetInvolvedCard[] = (
  parse(getInvolvedYaml) as { cards: GetInvolvedCard[] }
).cards;

// Helper to split into featured / non-featured
export const featuredCards = cards.filter(c => c.featured);
export const moreCards = cards.filter(c => !c.featured);