import { parse } from 'yaml';
import type { ImageMetadata } from 'astro';

export interface TeamMember {
  name: string;
  role: string;
  photo?: string | ImageMetadata;
  link?: string;
}

// Auto-import all photos from the team folder using Vite's glob import
// This means new photos just need to be added to src/assets/team/ - no code changes needed!
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/team/*.{jpeg,jpg,png,webp,gif}',
  { eager: true }
);

// Build map of filename -> ImageMetadata
const photoMap: Record<string, ImageMetadata> = {};
for (const [path, module] of Object.entries(photoModules)) {
  // Extract filename from path like '../assets/team/theo.jpeg' -> 'theo.jpeg'
  const filename = path.split('/').pop()!;
  photoMap[filename] = module.default;
}

// Import YAML as raw text using Vite's ?raw suffix
import teamYaml from '../content/team.yml?raw';

const rawTeam = parse(teamYaml) as Array<{
  name: string;
  role: string;
  photo?: string;
  link?: string;
}>;

// Convert photo filenames to imported images
export const team: TeamMember[] = rawTeam.map(member => ({
  ...member,
  photo: member.photo ? photoMap[member.photo] : undefined,
}));
