import type { Rsvp } from '~/models/rsvp.server';

export const filterRSVPs = (rsvps: Omit<Rsvp, 'createdAt' | 'updatedAt'>[]): [attending: Omit<Rsvp, 'createdAt' | 'updatedAt'>[], notAttending: Omit<Rsvp, 'createdAt' | 'updatedAt'>[]] => {
  const attending: Omit<Rsvp, 'createdAt' | 'updatedAt'>[] = [];
  const notAttending: Omit<Rsvp, 'createdAt' | 'updatedAt'>[] = [];

  rsvps.forEach(rsvp => {
    if (rsvp.attendance) {
      attending.push(rsvp);
    } else {
      notAttending.push(rsvp);
    }
  });

  return [ attending, notAttending ];
}
