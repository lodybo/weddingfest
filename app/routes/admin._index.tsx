import { json, LoaderArgs } from '@remix-run/node';
import type { FullRSVP, RSVPStats } from '~/models/rsvp.server';
import { getRSVPs } from '~/models/rsvp.server';
import { useFetcher } from '@remix-run/react';
import RSVPTable from '~/components/RSVPTable';
import Stats from '~/components/Stats';
import RefreshButton from '~/components/RefreshButton';
import Loader from '~/components/Loader';
import { useEffect } from 'react';
import type { SerializeFrom } from '@remix-run/server-runtime';
import { requireAdmin } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const rsvps = await getRSVPs();

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

  return json({ rsvps, stats });
}

export default function AdminIndexRoute() {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data == null) {
      fetcher.load('/admin?index');
    }
  }, [fetcher]);

  let rsvps: SerializeFrom<FullRSVP>[] | undefined;
  let stats: RSVPStats | undefined;

  if (fetcher.state === 'idle' && fetcher.data) {
    rsvps = fetcher.data.rsvps;
    stats = fetcher.data.stats;
  }

  const isFetching = fetcher.state === 'loading';

  const handleRefresh = () => {
    fetcher.load('/admin?index');
  };

  return (
    <div className="relative space-y-6">
      {isFetching ? (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center bg-white/75">
          <Loader size="full" />
        </div>
      ) : null}

      <div className="flex flex-row items-center justify-between">
        <h1 className="mb-5 text-4xl">RSVP lijst</h1>
        <RefreshButton onRefresh={handleRefresh} />
      </div>

      <Stats stats={stats} />
      <RSVPTable Rsvps={rsvps} />
    </div>
  );
}
