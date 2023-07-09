import type { SerializeFrom } from '@remix-run/server-runtime';
import type { LinkProps } from '@remix-run/react';
import { Link, NavLink as NavigationLink } from '@remix-run/react';
import type { User } from '@prisma/client';

import Button from '~/components/Button';
import Anchor from '~/components/Anchor';
import Icon from '~/components/Icon';

export type MenuItem = {
  to: string;
  title: string;
};

type Props = {
  /**
   * The user, if available.
   */
  user?: User | SerializeFrom<User>;

  /**
   * A collection of menu items
   */
  menuItems?: MenuItem[];
};

export default function Navigation({ user, menuItems = [] }: Props) {
  return (
    <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-white px-8 shadow-md">
      <Link to="/">
        <h1 className={`font-handwriting text-4xl ${user ? 'ml-auto' : ''}`}>
          Weddingfest
        </h1>
      </Link>

      <ul className="flex flex-row items-center gap-4">
        {menuItems.map(({ to, title }) => (
          <li key={to}>
            <NavigationLink
              className={({ isActive }) =>
                `border-b-2 border-b-transparent pb-0.5 text-xl transition-all hover:border-b-cyan-200 hover:pb-1.5`
              }
              to={to}
            >
              {title}
            </NavigationLink>
          </li>
        ))}
        {user ? (
          <>
            <li>
              <Link className="text-2xl" to="/account">
                <Icon name="user-circle" prefix="far" />
              </Link>
            </li>
            <li>
              <form className="ml-auto mr-4" action="/uitloggen" method="post">
                <Button variant="normal" size="small" type="submit">
                  <span className="hidden sm:inline">Uitloggen</span>
                  <Icon
                    className="block sm:hidden"
                    name="arrow-right-from-bracket"
                  />
                </Button>
              </form>
            </li>
          </>
        ) : (
          <>
            <NavLink to="/inloggen">Inloggen</NavLink>
          </>
        )}
      </ul>
    </div>
  );
}

type NavLinkProps = LinkProps;

function NavLink({ children, ...props }: NavLinkProps) {
  return (
    <li className="text-xl">
      <Anchor {...props}>{children}</Anchor>
    </li>
  );
}
