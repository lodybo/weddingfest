import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/session.server';
import Navigation from '~/components/Navigation';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  const isUserAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Navigation user={user} />
      <div className="flex h-full w-full flex-row justify-center gap-12">
        <div className="h-full w-1/6 bg-cyan-200 px-8 pt-12">
          <h2 className="text-2xl">Menu</h2>

          <ul className="mt-5 space-y-2">
            <NavigationItem to="/account">Account</NavigationItem>
            <NavigationItem to="/account/instellingen">
              Instellingen
            </NavigationItem>
            {isUserAdmin ? (
              <NavigationItem to="/admin">Administrator</NavigationItem>
            ) : null}
          </ul>
        </div>

        <div className="w-5/6 px-8 pt-12">
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
        className="cursor-pointer border-b-2 border-b-cyan-800 pb-0 transition-all hover:border-b-cyan-500 hover:pb-0.5"
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}
