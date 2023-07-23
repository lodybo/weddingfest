import { useEffect, useState } from 'react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import sanitizeHtml from 'sanitize-html';
import * as Sentry from '@sentry/remix';
import { requireAdmin } from '~/session.server';
import RSVPForm from '~/components/RSVPForm';
import TicketForm from '~/components/TicketForm';
import type { SelectedPriceOption } from '~/models/payment.server';
import {
  convertSelectedTicketsToPriceOptions,
  createPayment,
  markPaymentAsComplete,
  priceOptions,
} from '~/models/payment.server';
import Button from '~/components/Button';
import { createRSVP } from '~/models/rsvp.server';
import type { RSVP } from '~/types/RSVP';
import { attendanceIsValid } from '~/validations/validations';
import { getErrorMessage } from '~/utils/utils';
import ErrorMessage from '~/components/ErrorMessage';
import SuccessMessage from '~/components/SuccessMessage';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  return json({
    options: priceOptions.filter((option) => option.slug !== 'gift'),
  });
}

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const {
    name,
    attendance,
    camping,
    diet,
    remarks,
    tickets: stringifiedTickets,
  } = Object.fromEntries(formData);
  console.log('stringifiedTickets', stringifiedTickets);
  invariant(typeof name === 'string', 'Name is required');
  invariant(attendanceIsValid(attendance), 'Attendance is required');
  invariant(typeof camping === 'string', 'Camping is required');
  invariant(typeof diet === 'string', 'Diet is required');
  invariant(typeof remarks === 'string', 'Remarks is required');
  invariant(typeof stringifiedTickets === 'string', 'Tickets are required');

  const tickets = convertSelectedTicketsToPriceOptions(
    JSON.parse(stringifiedTickets)
  );

  const entry: RSVP = {
    name: sanitizeHtml(name),
    attendance,
    camping: camping === 'true',
    diet: sanitizeHtml(diet),
    remarks: sanitizeHtml(remarks),
  };

  try {
    const { id } = await createRSVP(entry);
    await createPayment(tickets, id);
    await markPaymentAsComplete(id);

    return json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    Sentry.captureException(error);

    return json({ success: false, error: message }, { status: 500 });
  }
}

export default function AddRSVPPage() {
  const fetcher = useFetcher();
  const { options } = useLoaderData<typeof loader>();
  const [selectedTickets, setSelectedTickets] = useState<SelectedPriceOption[]>(
    []
  );
  const [rsvpFormData, setRsvpFormData] = useState<FormData | undefined>(
    undefined
  );

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      window.scrollTo(0, 0);
    }
  }, [fetcher]);

  const handleFormChange = (formData: FormData) => {
    setRsvpFormData(formData);
  };

  const handleSelectionChange = (selectedTickets: SelectedPriceOption[]) => {
    setSelectedTickets(selectedTickets);
  };

  const submitForm = () => {
    if (!rsvpFormData || !selectedTickets) return;

    const formData = new FormData();
    for (const [key, value] of rsvpFormData.entries()) {
      formData.append(key, value);
    }
    formData.append('tickets', JSON.stringify(selectedTickets));

    fetcher.submit(formData, { method: 'POST' });
  };

  return (
    <div className="relative space-y-6">
      {fetcher.data && fetcher.data.success ? (
        <SuccessMessage message="RSVP toegevoegd" />
      ) : null}
      {fetcher.data && !fetcher.data.success ? (
        <ErrorMessage message={fetcher.data.error} />
      ) : null}
      <RSVPForm onChange={handleFormChange} />

      <TicketForm
        options={options}
        onSelectionChange={handleSelectionChange}
        selectedTickets={selectedTickets}
      />

      <Button variant="primary" onClick={submitForm}>
        Opslaan
      </Button>
    </div>
  );
}
