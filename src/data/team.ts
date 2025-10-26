import type { ImageMetadata } from 'astro';

export interface TeamMember {
  name: string;
  role: string;
  photo?: string | ImageMetadata;
  link?: string;
}

import theo from '../assets/team/theo.jpeg';
import eve from '../assets/team/eve.jpeg';
import quinn from '../assets/team/quinn.jpeg';
import bella from '../assets/team/bella-pic.jpg';
import patrick from '../assets/team/patrick.jpeg';
import leonie from '../assets/team/leonie.png';

export const team: TeamMember[] = [
  {
    name: "Theo",
    role: "Lead Organiser",
    photo: theo
  },
  {
    name: "Eve",
    role: "Co-organiser and Treasurer",
    photo: eve
  },
  {
    name: "Quinn",
    role: "Co-organiser and Secretary",
    photo: quinn
  },
  {
    name: "Bella",
    role: "Publicity Officer",
    photo: bella
  },
  {
    name: "Patrick",
    role: "PhD Researcher (Mechinterp)",
    link: "https://www.durham.ac.uk/staff/patrick-leask/",
    photo: patrick
  },
  {
    name: "Leonie",
    role: "PhD Researcher (Law)",
    link: "https://www.durham.ac.uk/staff/leonie-a-stuessi/",
    photo: leonie
  }
];
