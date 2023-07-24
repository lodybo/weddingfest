import type { LoaderArgs } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';

import { requireAdmin } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  return null;
}

export default function AdminPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 grid-rows-[6rem_1fr] gap-4 [grid-template-areas:_'navigation'_'content'] md:grid-cols-[15rem_1fr] md:grid-rows-[100%] md:gap-12">
      <div className="flex h-full w-full flex-col items-center gap-2 bg-rose-200 px-8 pt-2 [grid-area:_'navigation'] md:items-start md:gap-6 md:pt-12">
        <h2 className="text-2xl">Menu</h2>

        <ul className="flex flex-row gap-2 md:flex-col">
          <NavigationItem to="/admin">Administratie</NavigationItem>
          <NavigationItem to="/admin/pages">Pagina's</NavigationItem>
          <NavigationItem to="/account">Account</NavigationItem>
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
        className="cursor-pointer border-b-2 border-b-rose-800 pb-0 transition-all hover:border-b-rose-500 hover:pb-0.5"
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}
