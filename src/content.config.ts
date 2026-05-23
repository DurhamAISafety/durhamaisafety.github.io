import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/pages' }),
  schema: z.any(),
});

const getInvolved = defineCollection({
  loader: glob({ pattern: 'get-involved.yml', base: './src/content' }),
  schema: z.any(),
});

const programmes = defineCollection({
  loader: glob({ pattern: 'programmes.yml', base: './src/content' }),
  schema: z.any(),
});

export const collections = {
  pages,
  'get-involved': getInvolved,
  programmes,
};
