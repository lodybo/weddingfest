import type { Rsvp } from '@prisma/client';

export type RSVP = Omit<Rsvp, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  id?: string | null;
  userId?: string | null;
};

export type RSVPValidationErrors = {
  name?: string;
  attendance?: string;
  attendeeID?: string;
  camping?: string;
  diet?: string;
  remarks?: string;
};

interface BaseAttendanceResponse {
  success: boolean;
}

export interface SuccessfulAttendanceResponse
  extends BaseAttendanceResponse,
    RSVP {
  success: true;
}

export interface FailedAttendanceResponse extends BaseAttendanceResponse {
  success: false;
  errors: RSVPValidationErrors;
}

export type AttendanceResponse =
  | SuccessfulAttendanceResponse
  | FailedAttendanceResponse;
