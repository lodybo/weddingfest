import Countdown from 'react-countdown';
import CountdownTimer from '~/components/CountdownTimer';

export default function SmallWeddingTimer() {
  return (
    <Countdown date={new Date(2023, 7, 19, 16)} renderer={CountdownTimer} />
  );
}
