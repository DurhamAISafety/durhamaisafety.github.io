import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  SupportersQuery,
  SupportersSupporters,
} from '../../tina/__generated__/types';

export interface Supporter {
  name: string;
  logo: string;
  link: string;
  subtitle?: string;
  _source: SupportersSupporters;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getSupportersContent(): Promise<{
  document: SupportersQuery['supporters'];
  supporters: Supporter[];
}> {
  const result = await requestWithMetadata(
    client.queries.supporters({ relativePath: 'supporters.yml' })
  );

  const document = result.data.supporters;
  const supporters = compact(document.supporters).map((supporter) => ({
    name: supporter.name,
    logo: supporter.logo,
    link: supporter.link,
    subtitle: supporter.subtitle ?? undefined,
    _source: supporter,
  }));

  return { document, supporters };
}
