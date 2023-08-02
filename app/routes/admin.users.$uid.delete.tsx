import type { LoaderArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import {
  checkUserHasRsvp,
  decoupleRsvpFromUser,
  deleteUserByID,
} from '~/models/user.server';
import Anchor from '~/components/Anchor';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const userID = params.uid;
  invariant(userID, 'De gebruiker is niet ingevuld');

  const userHasRsvp = await checkUserHasRsvp(userID);

  if (userHasRsvp) {
    await decoupleRsvpFromUser(userID);
  }

  await deleteUserByID(userID);

  return null;
}

export default function AdminUsersDelete() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="font-handwriting text-5xl">Gebruiker verwijderd</h1>
      <Anchor to="/admin/users">Terug naar overzicht</Anchor>
    </div>
  );
}
