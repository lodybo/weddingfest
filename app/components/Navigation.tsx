import type { SerializeFrom } from '@remix-run/server-runtime';
import { Link } from '@remix-run/react';
import type { User } from '@prisma/client';

import Button from '~/components/Button';
import Icon from '~/components/Icon';
import NavigationLink from '~/components/NavigationLink';

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
    <div className="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-white px-8 shadow-md">
      <Link to="/">
        <h1 className={`font-handwriting text-4xl ${user ? 'ml-auto' : ''}`}>
          Weddingfest
        </h1>
      </Link>

      <ul className="flex flex-row items-center gap-4">
        {menuItems.map(({ to, title }) => (
          <NavigationLink key={to} to={to} title={title} />
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
            <NavigationLink to="/inloggen" title="Inloggen" />
          </>
        )}
      </ul>
    </div>
  );
}
