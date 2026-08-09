import { readYaml } from './content';

export interface Supporter {
  logo: string;
  link: string;
}

export async function getSupportersContent(): Promise<{ supporters: Supporter[] }> {
  const { home } = readYaml<{ home?: { supporters?: Supporter[] } }>('pages/home.yml');
  if (!home) {
    throw new Error('Validation Error: Missing home page configuration object.');
  }
  const supporters = (home.supporters ?? []).map((supporter) => ({
    logo: supporter.logo,
    link: supporter.link,
  }));

  return { supporters };
}
