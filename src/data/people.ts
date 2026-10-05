import { readYaml } from './content';

interface RawPerson {
  name: string;
  role: string;
  type?: string;
  start_year?: number | null;
  years_active?: string;
  photo?: string;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
  /** Booking link (e.g. zcal, Calendly) shown as a "Book a chat" button. */
  calendar?: string;
  description?: string;
}

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
  /** Booking link (e.g. zcal, Calendly) shown as a "Book a chat" button. */
  calendar?: string;
  description?: string;
}

export type TeamMember = Person & { type: 'member' };
export type AlumniMember = Person & { type: 'alumnus' };

export async function getPeopleContent(): Promise<{
  people: Person[];
  team: TeamMember[];
  alumni: AlumniMember[];
}> {
  const { people: rawPeople = [] } = readYaml<{ people?: RawPerson[] }>('people.yml');
  for (const person of rawPeople) {
    if (person.calendar && !/^https:\/\/\S+$/.test(person.calendar)) {
      throw new Error(`people.yml: calendar for "${person.name}" must be a full https:// booking link, got "${person.calendar}".`);
    }
  }
  const people: Person[] = rawPeople.map((person) => ({
    name: person.name,
    role: person.role,
    type: person.type === 'alumnus' ? 'alumnus' : 'member',
    start_year: person.start_year ?? undefined,
    years_active: person.years_active || undefined,
    photo: person.photo || undefined,
    linkedin: person.linkedin || undefined,
    'durham-staff-link': person['durham-staff-link'] || undefined,
    link: person.link || undefined,
    calendar: person.calendar || undefined,
    description: person.description || undefined,
  }));

  return {
    people,
    team: people.filter((person): person is TeamMember => person.type === 'member'),
    alumni: people.filter((person): person is AlumniMember => person.type === 'alumnus'),
  };
}
