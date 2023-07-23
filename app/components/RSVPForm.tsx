import { Form } from '@remix-run/react';

import HoneyPotField from '~/components/HoneyPotField';
import NameField from '~/components/NameField';
import AttendanceField from '~/components/AttendanceField';

import type { FailedAttendanceResponse, RSVP } from '~/types/RSVP';
import CampingField from '~/components/CampingField';
import DietField from '~/components/DietField';
import RemarksField from '~/components/RemarksField';
import { AuthenticityTokenInput } from 'remix-utils';
import Button from '~/components/Button';

type Props = {
  rsvp?: RSVP | null;
  response?: FailedAttendanceResponse;
  mode?: 'create' | 'edit';
  onChange?: (formData: FormData) => void;
};

export default function RSVPForm({
  response,
  rsvp,
  mode = 'create',
  onChange,
}: Props) {
  const {
    name: nameMessage,
    attendance: attendanceMessage,
    camping: campingMessage,
  } = response?.errors || {};
  const { id, name, attendance, camping, diet, remarks } = rsvp || {};

  const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    if (onChange) {
      onChange(new FormData(event.target.form));
    }
  };

  return (
    <Form
      method="post"
      className="mx-auto my-10 flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 xl:max-w-2xl"
      onChange={handleFormChange}
    >
      <AuthenticityTokenInput />
      <HoneyPotField />

      {id && <input type="hidden" name="attendee" value={id} />}

      <NameField
        label="Wat is je naam/jullie namen?"
        value={name}
        error={nameMessage}
      />

      <AttendanceField value={attendance} error={attendanceMessage} />

      <CampingField value={camping} error={campingMessage} />

      <DietField value={diet} />

      <RemarksField value={remarks} />

      {!onChange ? (
        mode === 'create' ? (
          <Button type="submit" variant="primary">
            Verder
          </Button>
        ) : (
          <div className="flex w-full flex-row justify-between gap-5">
            <Button to="/account" variant="normal">
              Annuleren
            </Button>
            <Button type="submit" variant="primary">
              Opslaan
            </Button>
          </div>
        )
      ) : null}
    </Form>
  );
}
