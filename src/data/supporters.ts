import { parse } from 'yaml';

export interface Supporter {
  name: string;
  logo: string;
  link: string;
  subtitle?: string;
}

// Import YAML as raw text using Vite's ?raw suffix
import supportersYaml from '../content/supporters.yml?raw';

export const supporters: Supporter[] = parse(supportersYaml) as Supporter[];
