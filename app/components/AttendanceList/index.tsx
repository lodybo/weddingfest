import type { Rsvp } from '~/models/rsvp.server';

import Attendee from './Attendee';

import { filterRSVPs } from './utils';

type Props = {
  /**
   * The full list of rsvps.
   */
  rsvps: Omit<Rsvp, 'createdAt' | 'updatedAt'>[];
};

export default function AttendanceList({ rsvps }: Props) {
  const [ attending, notAttending ] = filterRSVPs(rsvps);

  return (
    <>
      <h2>Aanwezig ({attending.length})</h2>
      <ul>
        { attending.map(rsvp => (
          <li key={rsvp.id}>
            <Attendee rsvp={rsvp} />
          </li>
        )) }
      </ul>

      <h2>Niet aanwezig ({notAttending.length})</h2>
      <ul>
        { notAttending.map(rsvp => (
          <li key={rsvp.id}>
            <Attendee rsvp={rsvp} />
          </li>
        )) }
      </ul>
    </>
  );
}
