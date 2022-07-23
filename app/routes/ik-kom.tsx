import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import {
  VALIDATIONS,
  nameIsValid,
  attendanceIsValid,
  potluckIsValid,
} from '~/validations';
import invariant from 'tiny-invariant';

import Navigation from '~/components/Navigation';
import NameField from '~/components/NameField';
import AttendanceField from '~/components/AttendanceField';
import PotluckField from '~/components/PotluckField';
import ErrorMessage from '~/components/ErrorMessage';

import type { RSVP } from '~/types/RSVP';

import weddingCouple from '~/images/wedding-couple.jpg';

interface BaseAttendanceResponse {
  success: boolean;
}

interface SuccessfulAttendanceResponse extends BaseAttendanceResponse {
  success: true;
}

interface FailedAttendanceResponse extends BaseAttendanceResponse {
  success: false;
  name?: string;
  attendance?: string;
  potluck?: string;
}

type AttendanceResponse =
  | SuccessfulAttendanceResponse
  | FailedAttendanceResponse;

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const errors: Omit<FailedAttendanceResponse, 'success'> = {};

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

  const entry: RSVP = {
    name,
    attendance: attendance === 'true',
    potluck: potluck.split(','),
  };

  return json<AttendanceResponse>({ success: true }, { status: 200 });
}

export default function AttendancePage() {
  const data = useActionData<typeof action>();

  if (data?.success) {
    return <p>Thank you!</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation />

      <img
        className="mb-10 h-[50vh] w-full object-cover object-center"
        src={weddingCouple}
        alt="wedding couple"
      />

      <p className="prose md:prose-lg">
        Wij gaan trouwen en willen graag weten of je erbij bent! <br />
        We vragen je daarom onderstaand formulier in te vullen voor ons.
      </p>

      <Form
        method="post"
        className="my-10 flex w-1/4 flex-1 flex-col items-center justify-center gap-5"
      >
        <div className="w-full">
          <NameField />
          {data?.name ? <ErrorMessage message={data.name} /> : null}
        </div>

        <AttendanceField />
        {data?.attendance ? <ErrorMessage message={data.attendance} /> : null}

        <PotluckField />
        {data?.potluck ? <ErrorMessage message={data.potluck} /> : null}

        <button className="bg-cyan-200 px-8 py-4 text-slate-800 transition hover:bg-cyan-400 hover:text-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2">
          Verzenden
        </button>
      </Form>
    </div>
  );
}
