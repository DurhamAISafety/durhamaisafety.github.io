import { parse } from 'yaml';
import type { ImageMetadata } from 'astro';

export interface TeamMember {
  name: string;
  role: string;
  start_year?: number;
  photo?: string | ImageMetadata;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
}

export interface AlumniMember {
  name: string;
  role: string;
  years_active?: string;
  photo?: string | ImageMetadata;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
}

// Auto-import all photos from the team folder using Vite's glob import
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/team/*.{jpeg,jpg,png,webp,gif}',
  { eager: true }
);

// Build map of filename -> ImageMetadata
const photoMap: Record<string, ImageMetadata> = {};
for (const [path, module] of Object.entries(photoModules)) {
  const filename = path.split('/').pop()!;
  photoMap[filename] = module.default;
}

import peopleYaml from '../content/people.yml?raw';

type RawPerson = Omit<TeamMember & AlumniMember, 'photo'> & {
  type: 'member' | 'alumnus';
  photo?: string;
};

const raw = parse(peopleYaml) as { people: RawPerson[] };

const resolve = (p: RawPerson) => ({ ...p, photo: p.photo ? photoMap[p.photo] : undefined });

export const team: TeamMember[] = raw.people.filter(p => p.type === 'member').map(resolve);
export const alumni: AlumniMember[] = raw.people.filter(p => p.type === 'alumnus').map(resolve);
