import { readYaml } from './content';

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

const sortPapers = (papers: ResearchPaper[]): ResearchPaper[] => papers.sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return (b.month || 0) - (a.month || 0);
});

export async function getResearchContent(): Promise<{
  research: ResearchPaper[];
  academicPapers: ResearchPaper[];
  nonAcademicPapers: ResearchPaper[];
}> {
  const { research: researchPage } = readYaml<{ research?: { papers?: ResearchPaper[] } }>('pages/research.yml');
  if (!researchPage) {
    throw new Error('Validation Error: Missing research page configuration object.');
  }
  const research = sortPapers((researchPage.papers ?? []).map((paper) => ({
    title: paper.title,
    url: paper.url,
    thumbnail: paper.thumbnail ?? undefined,
    authors: (paper.authors ?? []).map((author) => ({
      name: author.name,
      team: author.team ?? undefined,
    })),
    year: paper.year,
    month: paper.month ?? undefined,
    venue: paper.venue,
    tags: paper.tags ?? [],
    type: paper.type === 'non-academic' ? 'non-academic' : 'academic',
  })));

  return {
    research,
    academicPapers: research.filter((paper) => paper.type === 'academic'),
    nonAcademicPapers: research.filter((paper) => paper.type === 'non-academic'),
  };
}
