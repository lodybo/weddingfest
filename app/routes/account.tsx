import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/session.server';
import Navigation from '~/components/Navigation';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Navigation user={user} />
      <div className="flex h-full w-full flex-row justify-center gap-12">
        <div className="h-full w-1/3 bg-cyan-200 px-8 pt-12">
          <h2 className="text-2xl">Menu</h2>

          <ul>
            <li className="text-lg">
              <Link to="/account">Account</Link>
            </li>
            <li className="text-lg">
              <Link to="/account/instellingen">Instellingen</Link>
            </li>
          </ul>
        </div>

        <div className="w-2/3 px-8 pt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
