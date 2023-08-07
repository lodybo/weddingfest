import type { LoaderArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import { decoupleRsvpFromUser, getUserById } from '~/models/user.server';
import Anchor from '~/components/Anchor';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getRSVPByUserId } from '~/models/rsvp.server';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const userID = params.uid;
  invariant(userID, 'De gebruiker is niet ingevuld');

  const rsvp = await getRSVPByUserId(userID);
  const user = await getUserById(userID);
  invariant(user, 'Gebruiker niet gevonden');

  if (rsvp) {
    await decoupleRsvpFromUser(userID);
    invariant(user, 'Gebruiker niet gevonden');
    return json({ user, rsvp });
  } else {
    return json({ user, rsvp: null });
  }
}

export default function AdminUsersDelete() {
  const { user, rsvp } = useLoaderData<typeof loader>();

  if (rsvp) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <h1 className="font-handwriting text-5xl">
          {user.name} is losgekoppeld van {rsvp.name}
        </h1>
        <Anchor to="/admin/users">Terug naar overzicht</Anchor>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="font-handwriting text-5xl">
        Geen rsvp gevonden voor {user.name}
      </h1>
      <Anchor to="/admin/users">Terug naar overzicht</Anchor>
    </div>
  );
}
