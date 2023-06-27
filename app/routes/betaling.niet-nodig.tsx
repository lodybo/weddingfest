import CenteredContentLayout from '~/layouts/CenteredContent';
import type { LoaderArgs } from '@remix-run/node';
import { getRsvpIDFromSession } from '~/session.server';
import { markPaymentAsComplete } from '~/models/payment.server';
import { RegisterForm } from '~/components/RegisterForm';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderArgs) {
  const rsvpId = await getRsvpIDFromSession(request);

  await markPaymentAsComplete(rsvpId);

  return json({ rsvp: rsvpId });
}

export default function PaymentNotNeededRoute() {
  const { rsvp } = useLoaderData<typeof loader>();

  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Dank je wel!</h1>

      <p className="text-2xl">
        Alles staat geregistreerd, we zien je op 19 augustus!
      </p>

      <p>
        Als je wil, kan je een account aanmaken. Dit geeft een aantal voordelen:
      </p>
      <ul className="list-inside list-disc">
        <li>Je kan je inschrijvingen beheren.</li>
        <li>Je kan e-mails krijgen met updates over de bruiloft.</li>
        <li>
          Op de dag zelf kan je op de bruiloft, via de website, op de hoogte
          gehouden worden van het programma.
        </li>
      </ul>

      <p>Lijkt je dat wat? Geef je dan hieronder op:</p>
      <RegisterForm rsvp={rsvp} />
    </CenteredContentLayout>
  );
}
