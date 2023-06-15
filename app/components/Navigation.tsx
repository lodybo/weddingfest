import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { User } from '@prisma/client';

import Button from '~/components/Button';
import Anchor from '~/components/Anchor';

type Props = {
  /**
   * The user, if available.
   */
  user?: User;
};

export default function Navigation({ user }: Props) {
  return (
    <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-white px-8 shadow-md">
      <Link to="/">
        <h1 className={`font-handwriting text-4xl ${user ? 'ml-auto' : ''}`}>
          Weddingfest
        </h1>
      </Link>

      <ul className="flex flex-row gap-4">
        {user ? (
          <li>
            <form className="ml-auto mr-4" action="/logout" method="post">
              <Button variant="primary" type="submit">
                Uitloggen
              </Button>
            </form>
          </li>
        ) : (
          <>
            <NavLink to="/login">Inloggen</NavLink>
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
