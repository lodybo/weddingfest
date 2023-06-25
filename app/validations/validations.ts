import type { RSVPValidationErrors } from '~/types/RSVP';
import type { ATTENDANCE } from '@prisma/client';

export enum VALIDATIONS {
  MISSING_NAME = 'Er is geen naam ingevuld, zo kunnen we niet zien wie je bent.',
  MISSING_ATTENDANCE = 'Laat je ons weten of je wel, of niet kan?',
  MISSING_ATTENDEE_ID = 'Er is geen aanwezige bekend.',
  MISSING_CAMPING = 'We willen graag weten of je blijft kamperen.',
  WRONG_TYPE = 'Er is iets fout gegaan met het versturen van het formulier.',
}

export const nameIsValid = (name: any): name is string =>
  typeof name === 'string' && name !== '';

export const attendanceIsValid = (attendance: any): attendance is ATTENDANCE =>
  typeof attendance === 'string' &&
  (attendance === 'ALL_DAY' ||
    attendance === 'EVENING' ||
    attendance === 'NONE');

export const attendeeIDIsValid = (attendeeID: any): attendeeID is string =>
  typeof attendeeID === 'string' && attendeeID !== '';

export const campingIsValid = (camping: any): camping is string =>
  typeof camping === 'string' && (camping === 'true' || camping === 'false');

export function validateRSVP(
  name: FormDataEntryValue | null,
  attendance: FormDataEntryValue | null,
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
