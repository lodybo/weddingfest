import { ATTENDANCE, Ticket } from '@prisma/client';
import type { Rsvp, Payment } from '@prisma/client';
import Icon from '~/components/Icon';
import type { SerializeFrom } from '@remix-run/server-runtime';
import { formatAmountInLocale } from '~/utils/utils';

type FullRSVP = Rsvp & {
  Payment:
    | (Payment & {
        tickets: Ticket[];
      })
    | null;
};

type Props = {
  Rsvps: SerializeFrom<FullRSVP>[];
};

export default function RSVPList({ Rsvps }: Props) {
  const translateAttendance = (attending: ATTENDANCE) => {
    switch (attending) {
      case ATTENDANCE.ALL_DAY:
        return 'Hele dag';

      case ATTENDANCE.EVENING:
        return 'Avond';

      default:
        return 'Niet aanwezig';
    }
  };

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr>
          <th className="text-left">Naam/Namen</th>
          <th className="text-left">Aanwezig</th>
          <th className="text-left">Kamperen</th>
          <th className="text-left">Dieet</th>
          <th className="text-left">Opmerking</th>
          <th className="text-left">Tickets</th>
          <th className="text-left">Betaald</th>
          <th className="text-left">Bedrag</th>
        </tr>
      </thead>

      <tbody>
        {Rsvps.map((rsvp) => (
          <tr key={rsvp.id}>
            <td>{rsvp.name}</td>
            <td>{translateAttendance(rsvp.attendance)}</td>
            <td>{rsvp.camping ? 'Ja' : 'Nee'}</td>
            <td>{rsvp.diet}</td>
            <td>{rsvp.remarks}</td>
            <td>{rsvp.Payment?.tickets.length}</td>
            <td>{rsvp.Payment?.paid ? <Icon name="check" /> : null}</td>
            <td>
              {formatAmountInLocale(parseInt(rsvp.Payment?.total ?? '0'))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
