import { parse } from 'yaml';

export interface Author {
  /** Displayed name, e.g., "Leask, P." or "Patrick Leask" */
  name: string;
  /** Optional explicit override: when true, always bold; when false, never bold; when undefined, try auto-detect via team list. */
  team?: boolean;
}

export interface ResearchPaper {
  title: string;
  url: string;
  authors: Author[];
  year: number;
  month?: string; // e.g., "April", "July"
  venue: string; // e.g., "International Conference on Machine Learning (ICML 2025), Vancouver, Canada"
  tags: string[];
  type?: 'academic' | 'non-academic';
}

// Import YAML as raw text using Vite's ?raw suffix
import researchYaml from '../content/research.yml?raw';

export const research: ResearchPaper[] = parse(researchYaml) as ResearchPaper[];
