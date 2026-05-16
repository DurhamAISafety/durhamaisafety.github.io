import type { IslandRegistry } from '@tinacms/astro/experimental';
import GetInvolvedPageIsland from '../components/tina-islands/GetInvolvedPageIsland.astro';
import ProgrammesPageIsland from '../components/tina-islands/ProgrammesPageIsland.astro';
import ResearchPageIsland from '../components/tina-islands/ResearchPageIsland.astro';
import SupportersGrid from '../components/tina-islands/SupportersGrid.astro';
import SupportersHeroStrip from '../components/tina-islands/SupportersHeroStrip.astro';
import { getGetInvolvedContent } from '../data/get-involved';
import { getProgrammesContent } from '../data/programmes';
import { getResearchContent } from '../data/research';
import { getSupportersContent } from '../data/supporters';

export const tinaIslands = {
  programmes: {
    fetch: async () => getProgrammesContent(),
    component: ProgrammesPageIsland,
    wrapper: { tag: 'div', className: 'contents' },
    propsFromData: (data) => {
      const { programmes } = data as Awaited<ReturnType<typeof getProgrammesContent>>;
      return { programmes };
    },
  },
  'get-involved': {
    fetch: async () => getGetInvolvedContent(),
    component: GetInvolvedPageIsland,
    wrapper: { tag: 'div', className: 'contents' },
    propsFromData: (data) => {
      const { featuredCards, moreCards } = data as Awaited<ReturnType<typeof getGetInvolvedContent>>;
      return { featuredCards, moreCards };
    },
  },
  research: {
    fetch: async () => getResearchContent(),
    component: ResearchPageIsland,
    wrapper: { tag: 'div', className: 'contents' },
    propsFromData: (data) => {
      const { academicPapers, nonAcademicPapers } = data as Awaited<ReturnType<typeof getResearchContent>>;
      return { academicPapers, nonAcademicPapers };
    },
  },
  'supporters-hero': {
    fetch: async () => getSupportersContent(),
    component: SupportersHeroStrip,
    wrapper: { tag: 'div', className: 'contents' },
    propsFromData: (data) => {
      const { supporters } = data as Awaited<ReturnType<typeof getSupportersContent>>;
      return { supporters };
    },
  },
  'supporters-grid': {
    fetch: async () => getSupportersContent(),
    component: SupportersGrid,
    wrapper: { tag: 'div', className: 'contents' },
    propsFromData: (data) => {
      const { supporters } = data as Awaited<ReturnType<typeof getSupportersContent>>;
      return { supporters };
    },
  },
} satisfies IslandRegistry;
