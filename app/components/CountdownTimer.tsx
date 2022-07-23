import type { CountdownRenderProps } from 'react-countdown';
import CountdownTimerItem from '~/components/CountdownTimerItem';

export default function CountdownTimer({
  days,
  hours,
  minutes,
  seconds,
}: CountdownRenderProps) {
  return (
    <div className="not-prose flex w-full justify-between font-handwriting">
      <CountdownTimerItem time={days} label="dagen" />
      <CountdownTimerItem time={hours} label="uren" />
      <CountdownTimerItem time={minutes} label="minuten" />
      <CountdownTimerItem time={seconds} label="seconden" />
    </div>
  );
}
