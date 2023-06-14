import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useActionData, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import AttendanceForm from '~/components/AttendanceForm';

import PageLayout from '~/layouts/Page';

import { editRSVP, getRSVP } from '~/models/rsvp.server';
import Button from '~/components/Button';
import type {
  AttendanceResponse,
  FailedAttendanceResponse,
  RSVP,
} from '~/types/RSVP';
import {
  attendanceIsValid,
  attendeeIDIsValid,
  nameIsValid,
  potluckIsValid,
  VALIDATIONS,
} from '~/validations/validations';
import Anchor from '~/components/Anchor';

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.rid;
  invariant(id !== undefined, 'ID needs to be set');

  const rsvp = await getRSVP(id);
  invariant(rsvp !== null, 'No RSVP found.');

  return json({ rsvp });
};

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const errors: Omit<FailedAttendanceResponse, 'success'> = {};

  if (body.get('emailfield') !== '') {
    const entry: RSVP = {
      name: '',
      attendance: false,
      potluck: [],
    };
    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
  }

  const name = body.get('name');
  if (!nameIsValid(name)) {
    errors.name = VALIDATIONS.MISSING_NAME;
  }

  const attendance = body.get('attendance');
  if (!attendanceIsValid(attendance)) {
    errors.attendance = VALIDATIONS.MISSING_ATTENDANCE;
  }

  const potluck = body.get('potluck');
  if (!potluckIsValid(potluck)) {
    errors.potluck = VALIDATIONS.MISSING_POTLUCK;
  }

  const attendeeID = body.get('attendee');
  if (!attendeeIDIsValid(attendeeID)) {
    errors.attendeeID = VALIDATIONS.MISSING_ATTENDEE_ID;
  }

  if (Object.keys(errors).length) {
    return json<AttendanceResponse>(
      {
        success: false,
        ...errors,
      },
      { status: 422 }
    );
  }

  invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
  invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
  invariant(potluckIsValid(potluck), VALIDATIONS.MISSING_POTLUCK);
  invariant(attendeeIDIsValid(attendeeID), VALIDATIONS.MISSING_ATTENDEE_ID);

  const entry: RSVP = {
    name,
    attendance: attendance === 'true',
    potluck: potluck.split(','),
  };

  await editRSVP(attendeeID, entry);

  return json<AttendanceResponse>({ success: true, ...entry }, { status: 200 });
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
