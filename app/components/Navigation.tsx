import type { SerializeFrom } from '@remix-run/server-runtime';
import { Link, useNavigation } from '@remix-run/react';
import type { User } from '@prisma/client';

import Button from '~/components/Button';
import Icon from '~/components/Icon';
import NavigationLink from '~/components/NavigationLink';
import { useEffect, useState } from 'react';

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
  const navigation = useNavigation();
  const [menuIsCollapsed, setMenuIsCollapsed] = useState(false);

  useEffect(() => {
    if (navigation.state !== 'idle' && menuIsCollapsed) {
      setMenuIsCollapsed(false);
    }
  }, [navigation, menuIsCollapsed]);

  const toggleMenu = () => {
    setMenuIsCollapsed(!menuIsCollapsed);
  };

  return (
    <div className="sticky top-0 z-10 flex h-20 w-full items-center justify-between bg-white px-8 shadow-md">
      <Link to="/">
        <h1 className={`font-handwriting text-4xl ${user ? 'ml-auto' : ''}`}>
          Weddingfest
        </h1>
      </Link>

      <div
        className={`fixed left-0 top-20 z-10 h-full w-full bg-white px-8 ${
          menuIsCollapsed ? 'block md:hidden' : 'hidden'
        }`}
      >
        <NavigationMenu menuItems={menuItems} user={user} />
      </div>

      <div className="flex w-full justify-end md:hidden">
        <button className="text-2xl" onClick={toggleMenu}>
          <Icon name={`${menuIsCollapsed ? 'times' : 'bars'}`} />
        </button>
      </div>

      <div className="hidden md:block">
        <NavigationMenu menuItems={menuItems} user={user} />
      </div>
    </div>
  );
}

function NavigationMenu({
  menuItems,
  user,
}: {
  menuItems: MenuItem[];
  user?: User | SerializeFrom<User>;
}) {
  return (
    <ul className="flex flex-col items-center gap-10 md:flex-row md:gap-4">
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
            <form className="ml-auto" action="/uitloggen" method="post">
              <Button variant="normal" size="small" type="submit">
                <span className="">Uitloggen</span>
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
  );
}
