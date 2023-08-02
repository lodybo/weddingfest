import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { FullRSVP, RSVPStats } from '~/models/rsvp.server';
import { findInRsVPs, getRSVPs } from '~/models/rsvp.server';
import { Link, useFetcher } from '@remix-run/react';
import RSVPTable from '~/components/RSVPTable';
import Stats from '~/components/Stats';
import RefreshButton from '~/components/RefreshButton';
import Loader from '~/components/Loader';
import { useEffect } from 'react';
import type { SerializeFrom } from '@remix-run/server-runtime';
import { requireAdmin } from '~/session.server';
import Button from '~/components/Button';
import Icon from '~/components/Icon';
import RSVPTableSearch from '~/components/RSVPTableSearch';
import { generateStatsFromRsvps } from '~/utils/utils';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const rsvps = await getRSVPs();

  const stats = generateStatsFromRsvps(rsvps);

  return json({ rsvps, stats });
}

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);

  const url = new URL(request.url);

  const query = url.searchParams.get('query');

  if (!query) {
    return null;
  }

  const results = await findInRsVPs(query);

  return json({ rsvps: results });
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
    if (fetcher.data.stats) {
      stats = fetcher.data.stats;
    }
  }

  const isFetching = fetcher.state === 'loading';

  const handleRefresh = () => {
    fetcher.load('/admin?index');
  };

  const handleSearch = (searchTerm: string) => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: `/admin?index&query=${searchTerm}`,
      }
    );
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

      <div className="mt-12 flex flex-col justify-between gap-3 sm:flex-row sm:gap-5">
        <div className="w-full flex-1">
          <RSVPTableSearch onSearch={handleSearch} />
        </div>
        <div className="flex w-auto flex-none items-end">
          <Button
            to="/admin/rsvp/add"
            className="flex flex-row gap-2.5"
            size="small"
          >
            <Icon name="plus" />
            RSVP toevoegen
          </Button>
        </div>
      </div>

      <RSVPTable
        Rsvps={rsvps}
        actions={(rsvp) => (
          <>
            <Link to={`/admin/rsvp/edit/${rsvp.id}`}>
              <Icon name="pencil" />
            </Link>
            <Link to={`/verwijderen/${rsvp.id}`}>
              <Icon name="trash" />
            </Link>
          </>
        )}
      />
    </div>
  );
}
