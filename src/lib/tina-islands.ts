import type { IslandRegistry } from '@tinacms/astro/experimental';
import GetInvolvedPageIsland from '../components/tina-islands/GetInvolvedPageIsland.astro';
import ProgrammesPageIsland from '../components/tina-islands/ProgrammesPageIsland.astro';
import { getGetInvolvedContent } from '../data/get-involved';
import { getProgrammesContent } from '../data/programmes';

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
} satisfies IslandRegistry;
