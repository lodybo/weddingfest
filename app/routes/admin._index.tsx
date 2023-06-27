import { json } from '@remix-run/node';
import type { RSVPStats } from '~/models/rsvp.server';
import { getRSVPs } from '~/models/rsvp.server';
import { useLoaderData } from '@remix-run/react';
import RSVPList from '~/components/RSVPList';
import Stats from '~/components/Stats';

export async function loader() {
  const rsvps = await getRSVPs();

  const stats: RSVPStats = {
    tickets: 0,
    payments: {
      paid: 0,
      unpaid: 0,
      amount: 0,
    },
    camping: 0,
    attending: {
      allDay: 0,
      eveningOnly: 0,
      notAttending: 0,
    },
  };

  for (const rsvp of rsvps) {
    stats.tickets += rsvp.Payment?.tickets.length ?? 0;
    rsvp.Payment?.paid ? stats.payments.paid++ : stats.payments.unpaid++;
    stats.payments.amount += parseInt(rsvp.Payment?.total.toString() ?? '0');
    stats.camping += rsvp.camping ? 1 : 0;
    stats.attending.allDay += rsvp.attendance === 'ALL_DAY' ? 1 : 0;
    stats.attending.eveningOnly += rsvp.attendance === 'EVENING' ? 1 : 0;
    stats.attending.notAttending += rsvp.attendance === 'NONE' ? 1 : 0;
  }

  return json({ rsvps, stats });
}

export default function AdminIndexRoute() {
  const { rsvps, stats } = useLoaderData<typeof loader>();

  if (!rsvps) return null;

  return (
    <div className="space-y-6">
      <h1 className="mb-5 text-4xl">RSVP lijst</h1>

      <Stats stats={stats} />
      <RSVPList Rsvps={rsvps} />
    </div>
  );
}
