import type { Ticket } from '@prisma/client';

import { prisma } from '~/db.server';
import { calculateTotalPrice } from '~/utils/utils';
import invariant from 'tiny-invariant';

interface BasePriceOption {
  slug: string;
  description: string;
  amount: number;
  type: 'ticket' | 'gift';
}

interface TicketPriceOption extends BasePriceOption {
  type: 'ticket';
}

interface GiftPriceOption extends BasePriceOption {
  type: 'gift';
}

export type PriceOption = TicketPriceOption | GiftPriceOption;

interface BaseSelectedPriceOption {
  quantity: string;
}

interface TicketSelectedPriceOption extends BaseSelectedPriceOption {
  option: TicketPriceOption;
}

interface GiftSelectedPriceOption extends BaseSelectedPriceOption {
  option: GiftPriceOption;
}

export type SelectedPriceOption =
  | TicketSelectedPriceOption
  | GiftSelectedPriceOption;

export const priceOptions: readonly PriceOption[] = Object.freeze([
  {
    slug: 'adult',
    description: 'Volwassenen ticket',
    type: 'ticket',
    amount: 0,
  },
  {
    slug: 'baby',
    description: 'Kinder ticket (0-3 jaar)',
    type: 'ticket',
    amount: 0,
  },
  {
    slug: 'child',
    description: 'Kinder (3+) ticket',
    type: 'ticket',
    amount: 0,
  },
  {
    slug: 'camping',
    description: 'Camping ticket (per tent, incl. ontbijt)',
    type: 'ticket',
    amount: 25,
  },
  {
    slug: 'gift',
    description:
      'Een gift voor de bruiloft (die we al kunnen gebruiken voor het feest)',
    type: 'gift',
    amount: 0,
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

export function markPaymentAsComplete(
  rsvpId: string,
  stripePaymentId?: string
) {
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

export function hasPayment(rsvpId: string) {
  return prisma.payment.findFirst({
    where: {
      rsvpId,
    },
  });
}

export function getTicketsForPayment(paymentId: string) {
  return prisma.ticket.findMany({
    where: {
      paymentId,
    },
  });
}

export function deletePayment(paymentId: string) {
  return prisma.payment.delete({
    where: {
      id: paymentId,
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
  const selectedPriceOptions: SelectedPriceOption[] = [];

  tickets.forEach((ticket) => {
    const selectedTicket = selectedPriceOptions.find(
      ({ option }) => option.slug === ticket.slug
    );

    if (selectedTicket) {
      selectedTicket.quantity = (
        parseInt(selectedTicket.quantity) + 1
      ).toString();
    } else {
      selectedPriceOptions.push({
        option: {
          slug: ticket.slug,
          description: priceOptions.find(
            (option) => option.slug === ticket.slug
          )?.description as string,
          type: 'ticket',
          amount: parseInt(ticket.amount.toString()),
        },
        quantity: '1',
      });
    }
  });

  return selectedPriceOptions;
}
