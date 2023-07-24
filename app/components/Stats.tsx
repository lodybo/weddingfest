import type { ReactNode } from 'react';
import type { RSVPStats } from '~/models/rsvp.server';
import { formatAmountInLocale } from '~/utils/utils';
import type { Props as IconProps } from '~/components/Icon';
import Icon from '~/components/Icon';

type Props = {
  stats: RSVPStats | undefined;
};

export default function Stats({ stats }: Props) {
  if (!stats) {
    return null;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:gap-12 md:justify-start">
        <StatColumn title={`Tickets (${stats.tickets.persons})`}>
          <Statistic name="user" label={stats.tickets.adult} />
          <Statistic name="child" label={stats.tickets.child} />
          <Statistic name="baby" label={stats.tickets.baby} />
          <li className="h-0 basis-full" />
          <Statistic name="campground" label={stats.tickets.camping} />
          <Statistic name="gift" label={stats.tickets.gift} />
          <Statistic name="ticket" label={stats.tickets.total} />
        </StatColumn>

        <StatColumn title="Aanwezigheid">
          <Statistic name="sun" label={stats.attending.allDay} />
          <Statistic name="moon" label={stats.attending.eveningOnly} />
          <Statistic
            prefix="far"
            name="circle-xmark"
            label={stats.attending.notAttending}
          />
        </StatColumn>

        <StatColumn title="Betalingen">
          <Statistic
            iconClassName="text-emerald-500"
            prefix="far"
            name="circle-check"
            label={stats.payments.paid}
          />
          <Statistic
            iconClassName="text-rose-500"
            prefix="far"
            name="circle-xmark"
            label={stats.payments.unpaid}
          />
          <Statistic
            name="coins"
            label={formatAmountInLocale(stats.payments.amount)}
          />
        </StatColumn>
      </div>
    </div>
  );
}

type StatisticProps = Pick<IconProps, 'name' | 'prefix'> & {
  iconClassName?: string;
  label: number | string;
};

function Statistic({
  label,
  name,
  prefix = 'fas',
  iconClassName = '',
}: StatisticProps) {
  return (
    <li className="grid grid-cols-[1.5rem_1fr]">
      <Icon className={iconClassName} prefix={prefix} name={name} /> {label}
    </li>
  );
}

type StatColumnProps = {
  title: string;
  children: ReactNode;
};

function StatColumn({ title, children }: StatColumnProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-xl">{title}</p>
      <div className="flex flex-row gap-4">
        <ul className="min-h-10 flex w-full flex-row flex-wrap justify-between gap-2 sm:h-32 sm:flex-col sm:justify-start">
          {children}
        </ul>
      </div>
    </div>
  );
}
