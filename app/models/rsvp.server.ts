import type { Rsvp, Ticket, Payment } from '@prisma/client';
import type { RSVP as RSVPData } from '~/types/RSVP';

import { prisma } from '~/db.server';

export type { Rsvp } from '@prisma/client';

export type FullRSVP = Rsvp & {
  Payment:
    | (Payment & {
        tickets: Ticket[];
      })
    | null;
};

export type RSVPStats = {
  tickets: {
    adult: number;
    child: number;
    baby: number;
    persons: number;
    camping: number;
    gift: number;
    total: number;
  };
  payments: {
    paid: number;
    unpaid: number;
    amount: number;
  };
  attending: {
    allDay: number;
    eveningOnly: number;
    notAttending: number;
  };
};

export function getRSVPs() {
  return prisma.rsvp.findMany({
    include: {
      Payment: {
        include: {
          tickets: true,
        },
      },
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

export function getRSVPByUserId(userId: Rsvp['userId']) {
  return prisma.rsvp.findFirst({
    where: {
      userId,
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

export function findInRsVPs(query: string) {
  return prisma.rsvp.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      Payment: {
        include: {
          tickets: true,
        },
      },
    },
  });
}
