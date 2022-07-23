import type { Rsvp } from '@prisma/client';
import type { RSVP as RSVPData } from '~/types/RSVP';

import { prisma } from '~/db.server';

export type { Rsvp } from '@prisma/client';

export function getRSVPs() {
  return prisma.rsvp.findMany({
    select: {
      id: true,
      name: true,
      attendance: true,
      potluck: true,
    },
  });
}

export function getRSVP(id: Rsvp['id']) {
  return prisma.rsvp.findFirst({
    where: {
      id,
    },
  });
}

export function createRSVP({ name, attendance, potluck }: RSVPData) {
  return prisma.rsvp.create({
    data: {
      name,
      attendance,
      potluck,
    },
  });
}

export function editRSVP(
  id: Rsvp['id'],
  { name, attendance, potluck }: RSVPData
) {
  return prisma.rsvp.update({
    where: {
      id,
    },
    data: {
      name,
      attendance,
      potluck,
    },
  });
}
