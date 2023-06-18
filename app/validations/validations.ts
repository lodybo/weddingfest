import type { RSVPValidationErrors } from '~/types/RSVP';

export enum VALIDATIONS {
  MISSING_NAME = 'Er is geen naam ingevuld, zo kunnen we niet zien wie je bent.',
  MISSING_ATTENDANCE = 'Laat je ons weten of je wel, of niet kan?',
  MISSING_ATTENDEE_ID = 'Er is geen aanwezige bekend.',
  MISSING_GUESTS = 'Er is geen aantal gasten ingevuld.',
  INCORRECT_GUEST_TOTAL = 'Het aantal gasten is niet correct.',
  MISSING_CAMPING = 'We willen graag weten of je blijft kamperen.',
  WRONG_TYPE = 'Er is iets fout gegaan met het versturen van het formulier.',
}

export const nameIsValid = (name: any): name is string =>
  typeof name === 'string' && name !== '';

export const attendanceIsValid = (attendance: any): attendance is string =>
  typeof attendance === 'string' &&
  (attendance === 'true' || attendance === 'false');

export const attendeeIDIsValid = (attendeeID: any): attendeeID is string =>
  typeof attendeeID === 'string' && attendeeID !== '';

export const guestsAreValid = (guests: any): guests is string =>
  typeof guests === 'string' && guests !== '';

export const guestTotalIsValid = (guestTotal: string): boolean =>
  guestTotal !== '0';

export const campingIsValid = (camping: any): camping is string =>
  typeof camping === 'string' && (camping === 'true' || camping === 'false');

export function validateRSVP(
  name: FormDataEntryValue | null,
  attendance: FormDataEntryValue | null,
  guests: FormDataEntryValue | null,
  camping: FormDataEntryValue | null,
  diet: FormDataEntryValue | null,
  remarks: FormDataEntryValue | null,
  attendeeID?: FormDataEntryValue | null
): RSVPValidationErrors | undefined {
  let errors: RSVPValidationErrors = {};

  if (!nameIsValid(name)) {
    errors.name = VALIDATIONS.MISSING_NAME;
  }

  if (!attendanceIsValid(attendance)) {
    errors.attendance = VALIDATIONS.MISSING_ATTENDANCE;
  }

  if (!guestsAreValid(guests)) {
    errors.guests = VALIDATIONS.MISSING_GUESTS;
  } else if (!guestTotalIsValid(guests)) {
    errors.guests = VALIDATIONS.INCORRECT_GUEST_TOTAL;
  }

  if (!campingIsValid(camping)) {
    errors.camping = VALIDATIONS.MISSING_CAMPING;
  }

  if (typeof diet !== 'string') {
    errors.diet = VALIDATIONS.WRONG_TYPE;
  }

  if (typeof remarks !== 'string') {
    errors.remarks = VALIDATIONS.WRONG_TYPE;
  }

  if (attendeeID !== undefined) {
    if (!attendeeIDIsValid(attendeeID)) {
      errors.attendeeID = VALIDATIONS.MISSING_ATTENDEE_ID;
    }
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}
