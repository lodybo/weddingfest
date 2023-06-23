import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import AttendanceList from '~/components/AttendanceList';
import PageLayout from '~/layouts/Page';

import { getUserId } from '~/session.server';
import { getRSVPs } from '~/models/rsvp.server';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect('/');

  const rsvps = await getRSVPs();
  return json({ rsvps });
}

export default function AdminPage() {
  const { rsvps } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="flex w-full flex-row">
        <div className="w-1/4 flex-none px-4">
          <h2 className="mb-2 text-2xl">Menu</h2>
          <Link
            className="border-b-2 border-b-cyan-200 pb-0.5 transition-all hover:pb-1.5"
            to="/join"
          >
            Account registreren
          </Link>
        </div>

        <div className="prose w-3/4 flex-none px-4">
          <h1 className="mb-5 text-4xl">RSVP lijst</h1>
          <p>
            In totaal hebben {rsvps.length} mensen hun aanwezigheid opgegeven.
          </p>

          <AttendanceList rsvps={rsvps} />
        </div>
      </div>
    </PageLayout>
  );
}
