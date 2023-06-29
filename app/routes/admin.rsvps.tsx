import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/session.server';
import { getRSVPs } from '~/models/rsvp.server';
import RSVPOverview from '~/components/RSVPOverview';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const rsvps = await getRSVPs();

  return json({ rsvps });
}

export default function AdminRsvpsRoute() {
  const { rsvps } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="mb-5 text-4xl">RSVP lijst</h1>

      <RSVPOverview rsvps={rsvps} />
    </div>
  );
}
