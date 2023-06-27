import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';

import AttendanceList from '~/components/AttendanceList';
import PageLayout from '~/layouts/Page';

import { getUserId, requireAdmin } from '~/session.server';
import { getRSVPs } from '~/models/rsvp.server';
import Navigation from '~/components/Navigation';

export async function loader({ request }: LoaderArgs) {
  const user = await requireAdmin(request);

  return json({ user });
}

export default function AdminPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Navigation user={user} />
      <div className="flex h-full w-full flex-row justify-center gap-12">
        <div className="h-full w-1/4 bg-rose-200 px-8 pt-12">
          <h2 className="text-2xl">Menu</h2>

          <ul>
            <li className="text-lg">
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </div>

        <div className="w-3/4 px-8 pt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
