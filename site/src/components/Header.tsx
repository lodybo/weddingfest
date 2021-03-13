import React from 'react';
import Countdown from 'react-countdown';
import CountdownTimer from './CountdownTimer';

const Header = () => (
  <div className="
    container
    mx-auto
    h-screen
    flex
    flex-col
    justify-center
    items-center
  ">
    <h1 className="text-9xl">WeddingFest</h1>
    <h2 className="text-7xl">10 september 2022</h2>
    <Countdown
      date={new Date(2022, 8, 10)}
      renderer={CountdownTimer}
    />
  </div>
);

export default Header;