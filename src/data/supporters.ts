import { readYaml } from './content';

export interface Supporter {
  logo: string;
  link: string;
}

export async function getSupportersContent(): Promise<{ supporters: Supporter[] }> {
  const { supporters: rawSupporters = [] } = readYaml<{ supporters?: Supporter[] }>('supporters.yml');
  const supporters = rawSupporters.map((supporter) => ({
    logo: supporter.logo,
    link: supporter.link,
  }));

  return { supporters };
}
