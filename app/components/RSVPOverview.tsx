import type { SerializeFrom } from '@remix-run/server-runtime';
import type { FullRSVP } from '~/models/rsvp.server';
import TicketIcon from '~/components/TicketIcon';
import Icon from '~/components/Icon';
import { Link } from '@remix-run/react';

type Props = {
  rsvps: SerializeFrom<FullRSVP>[];
};

export default function RSVPOverview({ rsvps }: Props) {
  return (
    <>
      <h1>RSVP Overview</h1>
      <ul className="space-y-5">
        {rsvps.map((rsvp) => (
          <li className="flex flex-row items-start gap-2" key={rsvp.id}>
            <Link to={`/verwijderen/${rsvp.id}`}>
              <Icon name="trash" />
            </Link>

            <div className="flex flex-col gap-2">
              {rsvp.name}
              <ul className="flex flex-row gap-2">
                {rsvp.Payment?.tickets.map((ticket) => (
                  <li className="flex flex-row justify-between" key={ticket.id}>
                    <TicketIcon slug={ticket.slug} />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
