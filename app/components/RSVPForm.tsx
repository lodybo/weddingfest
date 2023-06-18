import { Form } from '@remix-run/react';

import HoneyPotField from '~/components/HoneyPotField';
import NameField from '~/components/NameField';
import AttendanceField from '~/components/AttendanceField';

import type { FailedAttendanceResponse, RSVP } from '~/types/RSVP';
import GuestsField from '~/components/GuestsField';
import CampingField from '~/components/CampingField';
import DietField from '~/components/DietField';
import RemarksField from '~/components/RemarksField';
import { AuthenticityTokenInput } from 'remix-utils';

type Props = {
  rsvp?: RSVP;
  response?: FailedAttendanceResponse;
};

export default function RSVPForm({ response, rsvp }: Props) {
  const {
    name: nameMessage,
    attendance: attendanceMessage,
    camping: campingMessage,
  } = response?.errors || {};
  const { id, name, attendance, camping, diet, remarks } = rsvp || {};

  return (
    <Form
      method="post"
      className="mx-auto my-10 flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 xl:max-w-2xl"
    >
      <AuthenticityTokenInput />
      <HoneyPotField />

      {id && <input type="hidden" name="attendee" value={id} />}

      <NameField value={name} error={nameMessage} />

      <GuestsField value={'1'} />

      <AttendanceField value={attendance} error={attendanceMessage} />

      <CampingField value={camping} error={campingMessage} />

      <DietField value={diet} />

      <RemarksField value={remarks} />

      <button className="bg-cyan-200 px-8 py-4 text-slate-800 transition hover:bg-cyan-400 hover:text-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2">
        Verzenden
      </button>
    </Form>
  );
}
