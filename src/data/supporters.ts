import path from 'node:path';
import sharp from 'sharp';
import { readYaml } from './content';

export interface Supporter {
  logo: string;
  link: string;
  /** Intrinsic size of the logo file, read at build time for the <img> width/height. */
  width?: number;
  height?: number;
}

export async function getSupportersContent(): Promise<{ supporters: Supporter[] }> {
  const { supporters: rawSupporters = [] } = readYaml<{ supporters?: Supporter[] }>('supporters.yml');
  const supporters = await Promise.all(
    rawSupporters.map(async (supporter) => {
      const { width, height } = await sharp(path.join(process.cwd(), 'public', supporter.logo)).metadata();
      return { logo: supporter.logo, link: supporter.link, width, height };
    }),
  );

  return { supporters };
}
