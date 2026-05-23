import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { HomePageQuery } from '../../tina/__generated__/types';

type SupporterSource = NonNullable<
  NonNullable<NonNullable<HomePageQuery['homePage']['home']>['supporters']>[number]
>;

export interface Supporter {
  logo: string;
  link: string;
  _source: SupporterSource;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getSupportersContent(): Promise<{
  document: HomePageQuery['homePage'];
  supporters: Supporter[];
}> {
  const result = await requestWithMetadata(
    client.queries.homePage({ relativePath: 'home.yml' })
  );

  const document = result.data.homePage;
  const home = document.home;
  if (!home) {
    throw new Error("Validation Error: Missing home page configuration object.");
  }
  const supporters = compact(home.supporters).map((supporter) => ({
    logo: supporter.logo,
    link: supporter.link,
    _source: supporter,
  }));

  return { document, supporters };
}
