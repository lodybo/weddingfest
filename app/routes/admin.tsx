import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';

import { requireAdmin } from '~/session.server';
import Navigation from '~/components/Navigation';

export async function loader({ request }: LoaderArgs) {
  const user = await requireAdmin(request);

  return json({ user });
}

export default function AdminPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation user={user} />
      <div className="grid h-full w-full grid-cols-1 grid-rows-[4rem_1fr] gap-4 [grid-template-areas:_'navigation'_'content'] md:grid-cols-[10rem_1fr] md:grid-rows-1 md:gap-12">
        <div className="flex h-full w-full flex-row items-center gap-6 bg-rose-200 px-8 pt-0 [grid-area:_'navigation'] md:flex-col md:items-start md:pt-12">
          <h2 className="text-2xl">Menu</h2>

          <ul>
            <NavigationItem to="/account">Account</NavigationItem>
          </ul>
        </div>

        <div className="w-full px-8 pt-0 [grid-area:_'content'] md:pt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NavigationItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <li className="text-lg">
      <NavLink
        className="cursor-pointer border-b-2 border-b-rose-800 pb-0 transition-all hover:border-b-rose-500 hover:pb-0.5"
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}
