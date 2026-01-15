import { parse } from 'yaml';

export interface Author {
  name: string;
  team?: boolean;
}

export interface ResearchPaper {
  title: string;
  url: string;
  thumbnail?: string;
  authors: Author[];
  year: number;
  month?: number; // 1-12 for ordering
  venue: string;
  tags: string[];
  type: 'academic' | 'non-academic';
}

// Import YAML as raw text using Vite's ?raw suffix
import researchYaml from '../content/research.yml?raw';

// Parse and sort by year then month (most recent first)
const rawPapers = parse(researchYaml) as ResearchPaper[];
export const research: ResearchPaper[] = rawPapers.sort((a, b) => {
  // Sort by year first (descending)
  if (b.year !== a.year) return b.year - a.year;
  // Then by month (descending), treating missing month as 0
  return (b.month || 0) - (a.month || 0);
});

// Helper to get papers by type
export const academicPapers = research.filter(p => p.type === 'academic');
export const nonAcademicPapers = research.filter(p => p.type === 'non-academic');
