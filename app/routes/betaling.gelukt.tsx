import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { RegisterForm } from '~/components/RegisterForm';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const rsvpId = url.searchParams.get('rsvpId');

  return json({ rsvp: rsvpId });
}

export default function PaymentSucceededRoute() {
  const { rsvp } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="space-y-12">
        <h1 className="font-handwriting text-7xl">Betaling gelukt!</h1>

        <p className="text-2xl">
          Bedankt voor je betaling, we zien je op 19 augustus!
        </p>

        {rsvp ? (
          <>
            <p>
              Als je wil, kan je een account aanmaken. Dit geeft een aantal
              voordelen:
            </p>
            <ul className="list-inside list-disc">
              <li>Je kan je inschrijvingen beheren.</li>
              <li>Je kan e-mails krijgen met updates over de bruiloft.</li>
              <li>
                Op de dag zelf kan je op de bruiloft, via de website, op de
                hoogte gehouden worden van het programma.
              </li>
            </ul>

            <p>Lijkt je dat wat? Geef je dan hieronder op:</p>
            <RegisterForm rsvp={rsvp} />
          </>
        ) : null}
      </div>
    </>
  );
}
