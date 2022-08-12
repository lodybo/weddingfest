import { json, redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import AttendanceList from '~/components/AttendanceList';
import PageLayout from '~/layouts/Page';

import { getUserId } from '~/session.server';
import { getRSVPs } from '~/models/rsvp.server';
import type { Rsvp } from '~/models/rsvp.server';

type LoaderData = {
  rsvps: Omit<Rsvp, 'createdAt' | 'updatedAt'>[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");

  const rsvps = await getRSVPs();
  return json<LoaderData>({ rsvps, });
};

export default function AdminPage() {
  const { rsvps } = useLoaderData<LoaderData>();

  return (
    <PageLayout>
      <div className="flex w-full flex-row">
        <div className="flex-none w-1/4 px-4">
          <h2 className="text-2xl mb-2">Menu</h2>
          <Link className="border-b-2 border-b-cyan-200 pb-0.5 hover:pb-1.5 transition-all" to="/join">
            Account registreren
          </Link>
        </div>

        <div className="flex-none w-3/4 px-4 prose">
          <h1 className="text-4xl mb-5">RSVP lijst</h1>
          <p>In totaal hebben {rsvps.length} mensen hun aanwezigheid opgegeven.</p>

          <AttendanceList rsvps={rsvps} />
        </div>
      </div>
    </PageLayout>
  );
}
