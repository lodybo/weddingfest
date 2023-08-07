import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { requireUser } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  const isUserAdmin = user?.role === 'ADMIN';

  return (
    <div className="grid min-h-screen w-full grid-cols-1 grid-rows-[6rem_1fr] gap-4 [grid-template-areas:_'navigation'_'content'] md:grid-cols-[15rem_1fr] md:grid-rows-[100%] md:gap-12">
      <div className="flex h-full w-full flex-col items-center gap-2 bg-cyan-200 px-8 pt-2 [grid-area:_'navigation'] md:items-start md:gap-6 md:pt-12">
        <h2 className="text-2xl">Menu</h2>

        <ul className="flex flex-row gap-2 md:flex-col">
          <NavigationItem to="/account">Account</NavigationItem>
          <NavigationItem to="/account/instellingen">
            Instellingen
          </NavigationItem>
          {isUserAdmin ? (
            <NavigationItem to="/admin">Administrator</NavigationItem>
          ) : null}
        </ul>
      </div>

      <div className="w-full px-8 pt-0 [grid-area:_'content'] md:pt-12">
        <Outlet />
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
