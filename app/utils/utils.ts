import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

import type { User } from '~/models/user.server';
import type { PriceOption, SelectedPriceOption } from '~/models/payment.server';
import { Prisma } from '.prisma/client';
import { RSVPStats } from '~/models/rsvp.server';

const DEFAULT_REDIRECT = '/';

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect;
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string';
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  console.debug('deprecated');
  return typeof email === 'string' && email.length > 3 && email.includes('@');
}

export function getErrorMessage(err: unknown) {
  // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
  let message;
  if (err instanceof Error) message = err.message;
  else message = String(err);

  return message;
}

// Generate a slugify function that converts a string to a slug
// and removes any characters that aren't [a-zA-Z0-9-_].
// This is used to generate slugs for the title of each post.
// See https://stackoverflow.com/a/29202363/247243
export function slugify(str: string) {
  const a = 'àáäâãåăæąçćčđďèéëêęěğìíïîłñńòóöôõøőðřšßśťțùúüûůűŵýÿžżź·/_,:;';
  const b = 'aaaaaaaaacccddeeeeeeeegiiiiilnnooooooooðrsttuuuuuuuuuwyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export const formatAmountInLocale = (amount: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(
    amount
  );

export function calculateAndFormatPrice(amount: number, quantity: string) {
  return formatAmountInLocale(amount * parseInt(quantity));
}

export function calculateTotal(amount: number, quantity: string) {
  return amount * parseInt(quantity);
}

export function calculateAndFormatTotalPrice(
  selectedTickets: SelectedPriceOption[]
) {
  return formatAmountInLocale(
    selectedTickets.reduce(
      (total, ticket) =>
        total + calculateTotal(ticket.option.amount, ticket.quantity),
      0
    )
  );
}

export function calculateTotalPrice(tickets: PriceOption[]) {
  return tickets.reduce((total, ticket) => total + ticket.amount, 0);
}

// copied from (https://github.com/kentcdodds/kentcdodds.com/blob/ebb36d82009685e14da3d4b5d0ce4d577ed09c63/app/utils/misc.tsx#L229-L237)
export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function generateStatsFromRsvps(
  rsvps: Array<
    Prisma.RsvpGetPayload<{
      include: { Payment: { include: { tickets: boolean } } };
    }>
  >
) {
  const stats: RSVPStats = {
    tickets: {
      adult: 0,
      child: 0,
      baby: 0,
      persons: 0,
      camping: 0,
      gift: 0,
      total: 0,
    },
    payments: {
      paid: 0,
      unpaid: 0,
      amount: 0,
    },
    attending: {
      allDay: 0,
      eveningOnly: 0,
      notAttending: 0,
    },
  };

  for (const rsvp of rsvps) {
    rsvp.Payment?.tickets.forEach((ticket) => {
      switch (ticket.slug) {
        case 'adult':
          stats.tickets.adult++;
          stats.tickets.persons++;
          break;
        case 'child':
          stats.tickets.child++;
          stats.tickets.persons++;
          break;
        case 'baby':
          stats.tickets.baby++;
          stats.tickets.persons++;
          break;
        case 'camping':
          stats.tickets.camping++;
          break;
        case 'gift':
          stats.tickets.gift++;
          break;
        default:
          break;
      }

      stats.tickets.total++;
    });

    if (rsvp.Payment?.paid) {
      stats.payments.paid++;
      stats.payments.amount += parseInt(rsvp.Payment.total.toString());
    } else if (rsvp.attendance !== 'NONE') {
      stats.payments.unpaid++;
    }

    stats.attending.allDay += rsvp.attendance === 'ALL_DAY' ? 1 : 0;
    stats.attending.eveningOnly += rsvp.attendance === 'EVENING' ? 1 : 0;
    stats.attending.notAttending += rsvp.attendance === 'NONE' ? 1 : 0;
  }
  return stats;
}
