import { ATTENDANCE, PrismaClient } from '@prisma/client';
import { fakerNL as faker } from '@faker-js/faker';
import { priceOptions } from '~/models/payment.server';
import { calculateTotalPrice } from '~/utils/utils';

const prisma = new PrismaClient();

function getAttendingRSVPs() {
  return prisma.rsvp.findMany({
    where: {
      attendance: {
        not: ATTENDANCE.NONE,
      },
    },
  });
}

function createPaymentForRsvp(rsvpId: string) {
  const tickets = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
    const option = faker.helpers.arrayElement(priceOptions);

    if (option.type === 'gift') {
      option.amount = faker.number.int({ min: 10, max: 100 });
    }

    return option;
  });

  return prisma.payment.create({
    data: {
      rsvpId,
      total: calculateTotalPrice(tickets),
      paid: faker.datatype.boolean(),
      tickets: {
        create: tickets.map((ticket) => ({
          slug: ticket.slug,
          amount: ticket.amount,
        })),
      },
    },
  });
}

export async function createTicketsAndPayments() {
  const rsvps = await getAttendingRSVPs();

  return Promise.all(rsvps.map((rsvp) => createPaymentForRsvp(rsvp.id)));
}
