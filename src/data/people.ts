import { parse } from 'yaml';

export interface TeamMember {
  name: string;
  role: string;
  start_year?: number;
  photo?: string;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
}

export interface AlumniMember {
  name: string;
  role: string;
  years_active?: string;
  photo?: string;
  linkedin?: string;
  'durham-staff-link'?: string;
  link?: string;
}

import peopleYaml from '../content/people.yml?raw';

type RawPerson = Omit<TeamMember & AlumniMember, 'photo'> & {
  type: 'member' | 'alumnus';
  photo?: string;
};

const raw = parse(peopleYaml) as { people: RawPerson[] };

const resolve = (p: RawPerson) => ({
  ...p,
  photo: p.photo,
});

export const team: TeamMember[] = raw.people.filter(p => p.type === 'member').map(resolve);
export const alumni: AlumniMember[] = raw.people.filter(p => p.type === 'alumnus').map(resolve);
