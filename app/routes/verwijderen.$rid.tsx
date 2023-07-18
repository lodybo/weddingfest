import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { deleteRSVP } from '~/models/rsvp.server';
import Button from '~/components/Button';

export const loader = async ({ params }: LoaderArgs) => {
  const { rid: id } = params;
  invariant(id !== undefined, 'ID needs to be set');

  const user = await deleteRSVP(id);

  return json(user, { status: 200 });
};

export default function DeleteRSVP() {
  const { name } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="w-full px-8">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="mt-10 text-4xl">RSVP van {name} verwijderd!</h1>

          <Link to="/admin">
            <Button variant="primary">Terug</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
