import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/session.server';
import { getRSVPByUserId } from '~/models/rsvp.server';
import { useLoaderData } from '@remix-run/react';
import Button from '~/components/Button';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const rsvp = await getRSVPByUserId(user.id);

  return json({ user, rsvp });
}

export default function AccountRoute() {
  const { user, rsvp } = useLoaderData<typeof loader>();

  let attendance = 'Nee';
  if (rsvp) {
    if (rsvp.attendance === 'ALL_DAY') {
      attendance = 'De hele dag!';
    } else if (rsvp.attendance === 'EVENING') {
      attendance = 'Alleen het avondfeest';
    }
  }

  return (
    <div className="space-y-12">
      <h1 className="font-handwriting text-6xl">Hallo {user.name}!</h1>

      {rsvp ? (
        <div className="space-y-4">
          <ul className="space-y-4">
            <li>
              <strong>{rsvp.name}</strong>
            </li>
            <li>
              Ik ben aanwezig: <strong>{attendance}</strong>
            </li>
            <li>
              Ik kampeer: <strong>{rsvp.camping ? 'Ja' : 'Nee'}</strong>
            </li>
            {rsvp.diet ? (
              <li>
                Dieetwensen: <strong>{rsvp.diet}</strong>
              </li>
            ) : null}
            {rsvp.remarks ? (
              <li>
                Opmerkingen: <strong>{rsvp.remarks}</strong>
              </li>
            ) : null}
          </ul>

          <Button
            className="w-64"
            variant="primary"
            to={`/bewerk/rsvp/${rsvp.id}`}
          >
            Bewerk mijn RSVP
          </Button>
        </div>
      ) : null}
    </div>
  );
}
