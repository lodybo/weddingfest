import CenteredContentLayout from '~/layouts/CenteredContent';
import type { LoaderArgs } from '@remix-run/node';
import { getRsvpIDFromSession } from '~/session.server';
import { markPaymentAsComplete } from '~/models/payment.server';

export async function loader({ request }: LoaderArgs) {
  const rsvpId = await getRsvpIDFromSession(request);

  await markPaymentAsComplete(rsvpId);

  return null;
}

export default function PaymentNotNeededRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Dank je wel!</h1>

      <p className="text-2xl">
        Alles staat geregistreerd, we zien je op 19 augustus!
      </p>
    </CenteredContentLayout>
  );
}
