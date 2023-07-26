import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { json } from '@remix-run/node';
import { editRSVP, getRSVP } from '~/models/rsvp.server';
import type { SelectedPriceOption } from '~/models/payment.server';
import {
  convertPriceOptionsToSelectedTickets,
  convertSelectedTicketsToPriceOptions,
  createPayment,
  deletePayment,
  getTicketsForPayment,
  hasPayment,
  markPaymentAsComplete,
  priceOptions,
} from '~/models/payment.server';
import { requireAdmin } from '~/session.server';
import { attendanceIsValid } from '~/validations/validations';
import type { RSVP } from '~/types/RSVP';
import sanitizeHtml from 'sanitize-html';
import { getErrorMessage } from '~/utils/utils';
import * as Sentry from '@sentry/remix';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import SuccessMessage from '~/components/SuccessMessage';
import ErrorMessage from '~/components/ErrorMessage';
import RSVPForm from '~/components/RSVPForm';
import TicketForm from '~/components/TicketForm';
import Button from '~/components/Button';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const { rid } = params;
  invariant(rid !== undefined, 'RSVP ID is required');

  const rsvp = await getRSVP(rid);
  invariant(rsvp !== null, 'No RSVP found.');

  const payment = await hasPayment(rid);
  let selectedTickets: SelectedPriceOption[] = [];
  if (payment) {
    const tickets = await getTicketsForPayment(payment.id);
    selectedTickets = convertPriceOptionsToSelectedTickets(tickets);
  }

  return json({
    rsvp,
    options: priceOptions.filter((option) => option.slug !== 'gift'),
    selectedTickets,
  });
}

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const {
    attendee,
    name,
    attendance,
    camping,
    diet,
    remarks,
    tickets: stringifiedTickets,
  } = Object.fromEntries(formData);
  invariant(typeof attendee === 'string', 'ID is required');
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
    await editRSVP(attendee, entry);
    const payment = await hasPayment(attendee);
    if (payment) {
      await deletePayment(payment.id);
      await createPayment(tickets, attendee);
      await markPaymentAsComplete(attendee);
    }

    return json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    Sentry.captureException(error);

    return json({ success: false, error: message }, { status: 500 });
  }
}

export default function AdminEditRSVP() {
  const fetcher = useFetcher();
  const {
    rsvp,
    options,
    selectedTickets: rsvpTickets,
  } = useLoaderData<typeof loader>();
  const [selectedTickets, setSelectedTickets] =
    useState<SelectedPriceOption[]>(rsvpTickets);
  const [rsvpFormData, setRsvpFormData] = useState<FormData | undefined>(
    undefined
  );

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      window.scrollTo(0, 0);
    }
  }, [fetcher]);

  const handleFormChange = (formData: FormData) => {
    console.log(Object.fromEntries(formData));
    setRsvpFormData(formData);
  };

  const handleSelectionChange = (selectedTickets: SelectedPriceOption[]) => {
    setSelectedTickets(selectedTickets);
  };

  const submitForm = () => {
    const formData = new FormData();

    if (rsvpFormData) {
      for (const [key, value] of rsvpFormData.entries()) {
        formData.append(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(rsvp)) {
        if (typeof value === 'boolean')
          formData.append(key, value ? 'true' : 'false');
        if (typeof value === 'string') formData.append(key, value);
      }
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
      <RSVPForm rsvp={rsvp} onChange={handleFormChange} />

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
