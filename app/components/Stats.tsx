import type { RSVPStats } from '~/models/rsvp.server';
import { formatAmountInLocale } from '~/utils/utils';

type Props = {
  stats: RSVPStats;
};

export default function Stats({ stats }: Props) {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <p className="w-24">Tickets</p>
          <p>{stats.tickets}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">Hele dag aanwezig</p>
          <p>{stats.attending.allDay}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">'s Avonds aanwezig</p>
          <p>{stats.attending.eveningOnly}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">Niet aanwezig</p>
          <p>{stats.attending.notAttending}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <p className="w-24">Blijft slapen?</p>
          <p>{stats.camping}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">Betaald</p>
          <p>{stats.payments.paid}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">Niet betaald</p>
          <p>{stats.payments.unpaid}</p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="w-24">Bedrag</p>
          <p>{formatAmountInLocale(stats.payments.amount)}</p>
        </div>
      </div>
    </div>
  );
}
