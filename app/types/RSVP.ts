export interface RSVP {
  name: string;
  attendance: boolean;
  potluck: string[];
}

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
  name?: string;
  attendance?: string;
  potluck?: string;
}

export type AttendanceResponse =
  | SuccessfulAttendanceResponse
  | FailedAttendanceResponse;
