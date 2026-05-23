import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { AboutPageQuery } from '../../tina/__generated__/types';

type PersonSource = NonNullable<
  NonNullable<NonNullable<AboutPageQuery['aboutPage']['about']>['people']>[number]
>;

export interface Person {
  name: string;
  role: string;
  type: 'member' | 'alumnus';
  start_year?: number;
  years_active?: string;
  photo?: string;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
  description?: string;
  _source: PersonSource;
}

export type TeamMember = Person & { type: 'member' };
export type AlumniMember = Person & { type: 'alumnus' };

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getPeopleContent(): Promise<{
  document: AboutPageQuery['aboutPage'];
  people: Person[];
  team: TeamMember[];
  alumni: AlumniMember[];
}> {
  const result = await requestWithMetadata(
    client.queries.aboutPage({ relativePath: 'about.yml' })
  );

  const document = result.data.aboutPage;
  const about = document.about;
  if (!about) {
    throw new Error("Validation Error: Missing about page configuration object.");
  }
  const people: Person[] = compact(about.people).map((person) => ({
    name: person.name,
    role: person.role,
    type: person.type === 'alumnus' ? 'alumnus' : 'member',
    start_year: person.start_year ?? undefined,
    years_active: person.years_active ?? undefined,
    photo: person.photo ?? undefined,
    linkedin: person.linkedin ?? undefined,
    'durham-staff-link': person.durham_staff_link ?? undefined,
    link: person.link ?? undefined,
    description: person.description ?? undefined,
    _source: person,
  }));

  return {
    document,
    people,
    team: people.filter((person): person is TeamMember => person.type === 'member'),
    alumni: people.filter((person): person is AlumniMember => person.type === 'alumnus'),
  };
}
