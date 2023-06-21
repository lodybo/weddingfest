import type { Ticket } from '@prisma/client';

import { prisma } from '~/db.server';
import { calculateTotalPrice } from '~/utils/utils';
import invariant from 'tiny-invariant';

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
    amount: 0,
  },
  {
    slug: 'baby',
    description: 'Kinder ticket (0-3 jaar)',
    amount: 0,
  },
  {
    slug: 'child',
    description: 'Kinder (3+) ticket',
    amount: 0,
  },
  {
    slug: 'camping',
    description: 'Camping ticket (per tent, incl. ontbijt)',
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

export function getPaymentForRsvp(rsvpId: string) {
  return prisma.payment.findFirst({
    where: {
      rsvpId,
    },
    include: {
      tickets: true,
    },
  });
}

export async function getTotalPriceForRsvp(rsvpId: string) {
  const payment = await getPaymentForRsvp(rsvpId);
  invariant(payment, `Payment not found for rsvp ${rsvpId}`);

  return parseInt(payment.total.toString());
}

export function markPaymentAsComplete(rsvpId: string, stripePaymentId: string) {
  return prisma.payment.update({
    where: {
      rsvpId,
    },
    data: {
      paid: true,
      stripePaymentId,
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

export function convertPriceOptionsToSelectedTickets(
  tickets: Ticket[]
): SelectedPriceOption[] {
  const selectedTickets: SelectedPriceOption[] = [];

  tickets.forEach((priceOption) => {
    const selectedTicket = selectedTickets.find(
      (ticket) => ticket.option.slug === priceOption.slug
    );

    if (selectedTicket) {
      selectedTicket.quantity = (
        parseInt(selectedTicket.quantity) + 1
      ).toString();
    } else {
      selectedTickets.push({
        option: {
          slug: priceOption.slug,
          description: priceOptions.find(
            (option) => option.slug === priceOption.slug
          )?.description as string,
          amount: parseInt(priceOption.amount.toString()),
        },
        quantity: '1',
      });
    }
  });

  return selectedTickets;
}
