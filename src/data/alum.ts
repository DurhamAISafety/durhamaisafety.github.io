import { parse } from 'yaml';
import type { ImageMetadata } from 'astro';

export interface AlumniMember {
  name: string;
  role: string;
  photo?: string | ImageMetadata;
  link?: string;
}

// Auto-import all photos from the team folder using Vite's glob import
// Alumni photos are stored alongside team photos in src/assets/team/
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
import alumYaml from '../content/alum.yml?raw';

const rawAlum = parse(alumYaml) as Array<{
  name: string;
  role: string;
  photo?: string;
  link?: string;
}> | null;

// Convert photo filenames to imported images
// Handle case where YAML is empty or only contains comments
export const alumni: AlumniMember[] = (rawAlum || []).map(member => ({
  ...member,
  photo: member.photo ? photoMap[member.photo] : undefined,
}));
