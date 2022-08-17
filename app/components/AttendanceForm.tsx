import { Form } from '@remix-run/react';

import HoneyPotField from '~/components/HoneyPotField';
import NameField from '~/components/NameField';
import ErrorMessage from '~/components/ErrorMessage';
import AttendanceField from '~/components/AttendanceField';
import PotluckField from '~/components/PotluckField';

import type { FailedAttendanceResponse } from '~/types/RSVP';
import type { Rsvp } from '~/models/rsvp.server';

type Props = {
  rsvp?: Omit<Rsvp, 'createdAt' | 'updatedAt'>;
  response?: FailedAttendanceResponse;
};

export default function AttendanceForm({ response, rsvp }: Props) {
  const { name: nameMessage, attendance: attendanceMessage, potluck: potluckMessage } = response || {};
  const { id, name, attendance, potluck } = rsvp || {};

  return (
    <Form
      method="post"
      className="my-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 xl:max-w-2xl"
    >
      <HoneyPotField />

      { id && (
        <input type="hidden" name="attendee" value={id} />
      )}

      <div className="w-full">
        <NameField value={name} />
        {nameMessage ? <ErrorMessage message={nameMessage} /> : null}
      </div>

      <AttendanceField value={attendance} />
      {attendanceMessage ? (
        <ErrorMessage message={attendanceMessage} />
      ) : null}

      <PotluckField value={potluck} />
      {potluckMessage ? <ErrorMessage message={potluckMessage} /> : null}

      <button className="bg-cyan-200 px-8 py-4 text-slate-800 transition hover:bg-cyan-400 hover:text-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2">
        Verzenden
      </button>
    </Form>
  );
}
