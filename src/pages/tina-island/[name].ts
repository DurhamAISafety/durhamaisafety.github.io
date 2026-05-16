import { experimental_createIslandRoute } from '@tinacms/astro/experimental';
import { tinaIslands } from '../../lib/tina-islands';

export const prerender = false;
export const ALL = experimental_createIslandRoute(tinaIslands);
