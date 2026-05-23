import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { ResearchPageQuery } from '../../tina/__generated__/types';

type ResearchSource = NonNullable<
  NonNullable<NonNullable<ResearchPageQuery['researchPage']['research']>['papers']>[number]
>;
type AuthorSource = NonNullable<ResearchSource['authors']>[number];

export interface Author {
  name: string;
  team?: boolean;
  _source: AuthorSource;
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
  _source: ResearchSource;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

const sortPapers = (papers: ResearchPaper[]): ResearchPaper[] => papers.sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return (b.month || 0) - (a.month || 0);
});

export async function getResearchContent(): Promise<{
  document: ResearchPageQuery['researchPage'];
  research: ResearchPaper[];
  academicPapers: ResearchPaper[];
  nonAcademicPapers: ResearchPaper[];
}> {
  const result = await requestWithMetadata(
    client.queries.researchPage({ relativePath: 'research.yml' })
  );

  const document = result.data.researchPage;
  const researchPage = document.research;
  if (!researchPage) {
    throw new Error("Validation Error: Missing research page configuration object.");
  }
  const research = sortPapers(compact(researchPage.papers).map((paper) => ({
    title: paper.title,
    url: paper.url,
    thumbnail: paper.thumbnail ?? undefined,
    authors: compact(paper.authors).map((author) => ({
      name: author.name,
      team: author.team ?? undefined,
      _source: author,
    })),
    year: paper.year,
    month: paper.month ?? undefined,
    venue: paper.venue,
    tags: compact(paper.tags),
    type: paper.type === 'non-academic' ? 'non-academic' : 'academic',
    _source: paper,
  })));

  return {
    document,
    research,
    academicPapers: research.filter((paper) => paper.type === 'academic'),
    nonAcademicPapers: research.filter((paper) => paper.type === 'non-academic'),
  };
}
