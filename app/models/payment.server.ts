import type {
  Ticket as PrismaTicket,
  Payment as PrismaPayment,
  Discount as PrismaDiscount,
} from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';

import { prisma } from '~/db.server';
import { calculateTotal, calculateTotalPrice } from '~/utils/utils';

export type Ticket = SerializeFrom<PrismaTicket>;
export type Payment = SerializeFrom<PrismaPayment>;
export type Discount = SerializeFrom<PrismaDiscount>;

export type PriceOption = {
  slug: string;
  description: string;
  amount: number;
};

export type SelectedPriceOption = {
  option: PriceOption;
  quantity: string;
};

export const priceOptions: readonly PriceOption[] = Object.freeze([
  {
    slug: 'adult',
    description: 'Volwassenen ticket',
    amount: 70,
  },
  {
    slug: 'baby',
    description: 'Kinder ticket (0-3 jaar)',
    amount: 0,
  },
  {
    slug: 'child',
    description: 'Kinder (3+) ticket',
    amount: 50,
  },
  {
    slug: 'camping',
    description: 'Camping ticket (per tent)',
    amount: 25,
  },
]);

export function createPayment(tickets: PriceOption[], rsvpId: string) {
  const total = calculateTotalPrice(tickets);

  return prisma.payment.create({
    data: {
      paid: false,
      total,
      tickets: {
        create: tickets.map((ticket) => ({
          slug: ticket.slug,
          amount: ticket.amount,
        })),
      },
      rsvpId,
    },
  });
}

export function convertSelectedTicketsToPriceOptions(
  selectedTickets: SelectedPriceOption[]
): PriceOption[] {
  let options: PriceOption[] = [];

  selectedTickets.forEach((selectedTicket) => {
    for (let i = 0; i < parseInt(selectedTicket.quantity); i++) {
      options.push(selectedTicket.option);
    }
  });

  return options;
}
