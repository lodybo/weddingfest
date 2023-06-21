import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import TicketForm from '~/components/AttendanceList/TicketForm';
import PageLayout from '~/layouts/Page';
import { getRsvpIDFromSession } from '~/session.server';
import { getRSVP } from '~/models/rsvp.server';
import type { SelectedPriceOption } from '~/models/payment.server';
import {
  convertSelectedTicketsToPriceOptions,
  createPayment,
  priceOptions,
} from '~/models/payment.server';
import { useState } from 'react';
import PaymentSummary from '~/components/AttendanceList/PaymentSummary';
import Button from '~/components/Button';

export async function loader({ request }: LoaderArgs) {
  const rsvpID = await getRsvpIDFromSession(request);

  const rsvp = await getRSVP(rsvpID);
  invariant(rsvp, 'No RSVP found for ID');

  if (rsvp.attendance === 'NONE') {
    return redirect('/niet-aanwezig');
  }

  return json(
    {
      name: rsvp.name,
      options: priceOptions,
    },
    { status: 200 }
  );
}

export async function action({ request }: ActionArgs) {
  const rsvpID = await getRsvpIDFromSession(request);

  const rsvp = await getRSVP(rsvpID);
  invariant(rsvp, 'No RSVP found for ID');

  const formData = await request.formData();
  const ticketRequestData = formData.get('tickets');
  invariant(typeof ticketRequestData, 'No tickets found in request');
  invariant(
    typeof ticketRequestData === 'string',
    'Tickets are of invalid type'
  );
  const selectedTickets = JSON.parse(
    ticketRequestData
  ) as SelectedPriceOption[];

  const tickets = convertSelectedTicketsToPriceOptions(selectedTickets);

  await createPayment(tickets, rsvpID);

  return redirect('/betalen');
}

export default function TicketRoute() {
  const fetcher = useFetcher();
  const { name, options } = useLoaderData<typeof loader>();
  const [selectedTickets, setSelectedTickets] = useState<SelectedPriceOption[]>(
    []
  );

  const handleSelectionChange = (selection: SelectedPriceOption[]) => {
    setSelectedTickets(selection);
  };

  const triggerPayment = async () => {
    fetcher.submit(
      {
        tickets: JSON.stringify(selectedTickets),
      },
      {
        method: 'POST',
      }
    );
  };

  return (
    <PageLayout>
      <div className="prose mx-auto max-w-full px-8 md:prose-lg">
        <h1 className="font-handwriting">Tickets ({name})</h1>
        <p>
          We hebben het in de brief al verteld, maar om dit feest een success te
          maken moeten we rekening houden met... de rekening! <br />
          Daarom hebben we besloten om een kleine bijdrage te vragen voor het
          feest, in plaats van een kado. <br />
          We hopen dat jullie dit begrijpen en dat jullie er net zo veel zin in
          hebben als wij!
        </p>

        <p>
          En om in de stijl van een festival te blijven hebben we daarom een
          echte ticket verkoop! Kies hieronder de tickets die voor je/jullie van
          toepassing zijn.
        </p>

        <div className="not-prose flex flex-col gap-8 md:gap-16 lg:flex-row">
          <div className="w-full flex-auto md:w-2/3">
            <TicketForm
              options={options}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          <div className="w-full flex-auto space-y-4 md:w-1/3">
            <PaymentSummary selectedTickets={selectedTickets} />
            <Button variant="primary" onClick={triggerPayment}>
              Bestellen
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
