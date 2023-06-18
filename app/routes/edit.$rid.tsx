import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useActionData, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import AttendanceForm from '~/components/AttendanceForm';

import PageLayout from '~/layouts/Page';

import { createRSVP, editRSVP, getRSVP } from '~/models/rsvp.server';
import Button from '~/components/Button';
import type {
  AttendanceResponse,
  FailedAttendanceResponse,
  RSVP,
} from '~/types/RSVP';
import {
  attendanceIsValid,
  attendeeIDIsValid,
  campingIsValid,
  guestsAreValid,
  guestTotalIsValid,
  nameIsValid,
  validateRSVP,
  VALIDATIONS,
} from '~/validations/validations';
import Anchor from '~/components/Anchor';
import type { RSVPValidationErrors } from '~/types/RSVP';

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.rid;
  invariant(id !== undefined, 'ID needs to be set');

  const rsvp = await getRSVP(id);
  invariant(rsvp !== null, 'No RSVP found.');

  return json({ rsvp });
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const errors: RSVPValidationErrors = {};

  if (body.get('emailfield') !== '') {
    const entry: RSVP = {
      name: '',
      attendance: false,
      diet: '',
      guests: 1,
      camping: false,
      remarks: '',
    };
    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
  }

  const { name, attendance, guests, camping, diet, remarks, attendeeID } =
    Object.fromEntries(body);

  const hasErrors = validateRSVP(
    name,
    attendance,
    guests,
    camping,
    diet,
    remarks,
    attendeeID
  );
  if (!hasErrors) {
    invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
    invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
    invariant(guestsAreValid(guests), VALIDATIONS.MISSING_GUESTS);
    invariant(guestTotalIsValid(guests), VALIDATIONS.INCORRECT_GUEST_TOTAL);
    invariant(campingIsValid(camping), VALIDATIONS.MISSING_CAMPING);
    invariant(
      typeof diet === 'string' && typeof remarks === 'string',
      'Diet and remarks should be strings'
    );

    const entry: RSVP = {
      name,
      attendance: attendance === 'true',
      guests: parseInt(guests as string, 10),
      camping: camping === 'true',
      diet,
      remarks,
    };

    await createRSVP(entry);

    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
  } else {
    return json<AttendanceResponse>(
      {
        success: false,
        errors,
      },
      { status: 422 }
    );
  }
}

export default function EditRSVP() {
  const { rsvp } = useLoaderData<typeof loader>();
  let data = useActionData<typeof action>();

  return (
    <PageLayout>
      <div className="w-full px-8">
        {data?.success ? (
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="mt-10 text-4xl">
              RSVP van <strong>{data.name}</strong> is bijgewerkt!
            </h1>

            <Link to="/admin">
              <Button variant="primary">Terug</Button>
            </Link>
          </div>
        ) : (
          <>
            <Anchor to="/admin">Terug</Anchor>
            <AttendanceForm response={data} rsvp={rsvp} />
          </>
        )}
      </div>
    </PageLayout>
  );
}
