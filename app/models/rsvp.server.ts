import type { Rsvp } from '@prisma/client';
import type { RSVP as RSVPData } from '~/types/RSVP';

import { prisma } from '~/db.server';

export type { Rsvp } from '@prisma/client';

export function getRSVPs() {
  return prisma.rsvp.findMany();
}

export function getRSVP(id: Rsvp['id']) {
  return prisma.rsvp.findFirst({
    where: {
      id,
    },
  });
}

export function createRSVP({
  name,
  attendance,
  camping,
  diet,
  remarks,
  userId,
}: RSVPData) {
  return prisma.rsvp.create({
    data: {
      name,
      attendance,
      camping,
      diet,
      remarks,
      userId,
    },
  });
}

export function editRSVP(
  id: Rsvp['id'],
  { name, attendance, camping, diet, remarks }: RSVPData
) {
  return prisma.rsvp.update({
    where: {
      id,
    },
    data: {
      name,
      attendance,
      camping,
      diet,
      remarks,
    },
  });
}

export function deleteRSVP(id: Rsvp['id']) {
  return prisma.rsvp.delete({
    where: {
      id,
    },
  });
}
