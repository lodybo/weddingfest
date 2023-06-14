export enum VALIDATIONS {
  MISSING_NAME = 'Er is geen naam ingevuld, zo kunnen we niet zien wie je bent.',
  MISSING_ATTENDANCE = 'Laat je ons weten of je wel, of niet kan?',
  MISSING_POTLUCK = 'Er is iets fout gegaan met de lijst van gerechten.',
  MISSING_ATTENDEE_ID = 'Er is geen aanwezige bekend.',
}

export const nameIsValid = (name: any): name is string =>
  typeof name === 'string' && name !== '';

export const attendanceIsValid = (attendance: any): attendance is string =>
  typeof attendance === 'string' &&
  (attendance === 'true' || attendance === 'false');

export const potluckIsValid = (potluck: any): potluck is string =>
  typeof potluck === 'string';

export const attendeeIDIsValid = (attendeeID: any): attendeeID is string =>
  typeof attendeeID === 'string' && attendeeID !== '';
