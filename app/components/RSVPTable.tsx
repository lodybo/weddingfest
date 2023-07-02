import { ATTENDANCE } from '@prisma/client';
import Icon from '~/components/Icon';
import type { SerializeFrom } from '@remix-run/server-runtime';
import { formatAmountInLocale } from '~/utils/utils';
import type { FullRSVP } from '~/models/rsvp.server';
import TicketIcon from '~/components/TicketIcon';
import Anchor from '~/components/Anchor';

type Props = {
  Rsvps: SerializeFrom<FullRSVP>[];
};

export default function RSVPTable({ Rsvps }: Props) {
  return (
    <table className="w-full table-fixed border-2 border-slate-100">
      <thead>
        <tr className="bg-stone-100">
          <th className="p-2.5 text-center sm:text-left">
            <span className="hidden sm:inline">Naam/Namen</span>
            <span className="inline sm:hidden">
              <Icon name="user" />
            </span>
          </th>
          <th className="hidden p-2.5 text-left lg:table-cell">Dieet</th>
          <th className="hidden p-2.5 text-left lg:table-cell">Opmerking</th>
          <th className="p-2.5 text-center sm:text-left">
            <span className="hidden sm:inline">Tickets</span>
            <span className="inline sm:hidden">
              <Icon name="ticket" />
            </span>
          </th>
          <th className="p-2.5 text-center sm:text-left">
            <span className="hidden sm:inline">Bedrag</span>
            <span className="inline sm:hidden">
              <Icon name="coins" />
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {Rsvps.map((rsvp) => (
          <tr className="odd:bg-stone-50" key={rsvp.id}>
            <td className="space-y-2 p-2.5">
              <p>{rsvp.name}</p>
              <div className="flex flex-row gap-2">
                {rsvp.attendance === ATTENDANCE.ALL_DAY ? (
                  <Icon name="sun" />
                ) : rsvp.attendance === ATTENDANCE.EVENING ? (
                  <Icon name="moon" />
                ) : (
                  <Icon prefix="far" name="circle-xmark" />
                )}

                {rsvp.camping ? <Icon name="campground" /> : null}
              </div>
            </td>
            <td className="hidden p-2.5 lg:table-cell">{rsvp.diet}</td>
            <td className="hidden p-2.5 lg:table-cell">{rsvp.remarks}</td>
            <td className="p-2.5">
              <div className="flex flex-row flex-wrap gap-2">
                {rsvp.Payment?.tickets.map(({ id, slug }) => (
                  <div key={id}>
                    <TicketIcon slug={slug} />
                  </div>
                ))}
              </div>
            </td>
            <td className="p-2.5">
              <div className="flex flex-row flex-wrap gap-2">
                {rsvp.attendance !== ATTENDANCE.NONE ? (
                  <>
                    {rsvp.Payment?.stripePaymentId ? (
                      <Anchor
                        to={`https://dashboard.stripe.com/payments/${rsvp.Payment.stripePaymentId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatAmountInLocale(
                          parseInt(rsvp.Payment?.total ?? '0')
                        )}
                      </Anchor>
                    ) : (
                      formatAmountInLocale(parseInt(rsvp.Payment?.total ?? '0'))
                    )}
                    {rsvp.Payment?.paid ? (
                      <Icon
                        className="text-emerald-600"
                        prefix="far"
                        name="circle-check"
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
