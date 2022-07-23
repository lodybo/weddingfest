import Countdown from 'react-countdown';
import CountdownTimer from '~/components/CountdownTimer';

export default function SmallWeddingTimer() {
  return (
    <Countdown date={new Date(2022, 7, 27, 16)} renderer={CountdownTimer} />
  );
}
