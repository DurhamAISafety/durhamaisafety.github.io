import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  PeoplePeople,
  PeopleQuery,
} from '../../tina/__generated__/types';

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
  _source: PeoplePeople;
}

export type TeamMember = Person & { type: 'member' };
export type AlumniMember = Person & { type: 'alumnus' };

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getPeopleContent(): Promise<{
  document: PeopleQuery['people'];
  people: Person[];
  team: TeamMember[];
  alumni: AlumniMember[];
}> {
  const result = await requestWithMetadata(
    client.queries.people({ relativePath: 'people.yml' })
  );

  const document = result.data.people;
  const people = compact(document.people).map((person) => ({
    name: person.name,
    role: person.role,
    type: person.type === 'alumnus' ? 'alumnus' : 'member',
    start_year: person.start_year ?? undefined,
    years_active: person.years_active ?? undefined,
    photo: person.photo ?? undefined,
    linkedin: person.linkedin ?? undefined,
    'durham-staff-link': person.durham_staff_link ?? undefined,
    link: person.link ?? undefined,
    _source: person,
  }));

  return {
    document,
    people,
    team: people.filter((person): person is TeamMember => person.type === 'member'),
    alumni: people.filter((person): person is AlumniMember => person.type === 'alumnus'),
  };
}
