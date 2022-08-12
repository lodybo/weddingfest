import type { User } from '@prisma/client';

import Button from '~/components/Button';

type Props = {
  /**
   * The user, if available.
   */
  user?: User;
};

export default function Navigation({ user }: Props) {
  return (
    <div className="sticky flex h-20 w-full items-center justify-center shadow-md">
      <h1 className={ `font-handwriting text-4xl ${ user ? 'ml-auto' : ''}` }>Kaylee & Lody</h1>
      {
        user ? (
          <form className="ml-auto mr-4" action="/logout" method="post">
            <Button variant="primary" type="submit">Uitloggen</Button>
          </form>
        ) : null
      }
    </div>
  );
}
