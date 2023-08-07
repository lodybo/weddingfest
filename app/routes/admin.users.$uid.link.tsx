import RSVPTableSearch from '~/components/RSVPTableSearch';
import Button from '~/components/Button';
import Icon from '~/components/Icon';
import RSVPTable from '~/components/RSVPTable';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import type { SerializeFrom } from '@remix-run/server-runtime';
import type { FullRSVP } from '~/models/rsvp.server';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { coupleRsvpToUser, getUserById } from '~/models/user.server';
import invariant from 'tiny-invariant';
import { getErrorMessage } from '~/utils/utils';
import SuccessMessage from '~/components/SuccessMessage';
import ErrorMessage from '~/components/ErrorMessage';
import { serverError } from 'remix-utils';
import { getRSVPs } from '~/models/rsvp.server';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const userId = params.uid;
  invariant(userId, 'No user id provided');

  const user = await getUserById(userId);
  invariant(user, 'No user found');

  return json({ user });
}

export async function action({ request }: LoaderArgs) {
  await requireAdmin(request);

  const data = await request.formData();
  const { rsvpId, userId } = Object.fromEntries(data);

  invariant(typeof rsvpId === 'string', 'No rsvp id provided');
  invariant(typeof userId === 'string', 'No user id provided');

  try {
    await coupleRsvpToUser(userId, rsvpId);
    const rsvps = await getRSVPs();
    return json({ success: true, rsvps });
  } catch (error) {
    const message = getErrorMessage(error);
    return serverError({ success: false, error: message });
  }
}

export default function AdminUserLink() {
  const fetcher = useFetcher();
  const { user } = useLoaderData<typeof loader>();
  const [showMessage, setShowMessage] = useState('');
  const [messageState, setMessageState] = useState<'message' | 'error'>(
    'message'
  );

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data == null) {
      fetcher.load('/admin?index');
    }

    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success) {
        setMessageState('message');
        setShowMessage(`Gelukt! ${user.name} is gekoppeld aan de RSVP`);
      } else if (fetcher.data.error) {
        setMessageState('error');
        setShowMessage(`Er ging iets mis: ${fetcher.data.error}`);
      }
    }
  }, [fetcher, user]);

  let rsvps: SerializeFrom<FullRSVP>[] | undefined;
  if (fetcher.state === 'idle' && fetcher.data) {
    if (fetcher.data.rsvps) {
      const fullRsvpList = fetcher.data.rsvps as SerializeFrom<FullRSVP>[];
      rsvps = fullRsvpList.filter((rsvp) => !rsvp.userId);
    }
  }

  const handleSearch = (searchTerm: string) => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: `/admin?index&query=${searchTerm}`,
      }
    );
  };

  const coupleRsvp = (rsvp: SerializeFrom<FullRSVP>) => {
    fetcher.submit(
      {
        rsvpId: rsvp.id,
        userId: user.id,
      },
      {
        method: 'POST',
      }
    );
  };

  return (
    <div className="relative space-y-6">
      <h1 className="font-handwriting text-5xl">Link gebruiker aan RSVP</h1>

      <p>
        Gebruiker: <span>{user?.name}</span>
      </p>

      {showMessage && messageState === 'message' && (
        <SuccessMessage message={showMessage} />
      )}

      {showMessage && messageState === 'error' && (
        <ErrorMessage message={showMessage} />
      )}

      <div className="mt-12 flex flex-col justify-between gap-3 sm:flex-row sm:gap-5">
        <div className="w-full flex-1">
          <RSVPTableSearch onSearch={handleSearch} />
        </div>
      </div>
      <RSVPTable
        Rsvps={rsvps}
        actions={(rsvp) => (
          <>
            <Button size="small" onClick={() => coupleRsvp(rsvp)}>
              <Icon name="link" />
            </Button>
          </>
        )}
      />
    </div>
  );
}
