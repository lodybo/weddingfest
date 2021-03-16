import React from 'react';
import Countdown from 'react-countdown';
import CountdownTimer from './CountdownTimer';

type HeaderProps = {
  full?: boolean,
};

const Header = ({
  full = false,
}: HeaderProps) => (
  <div className={ `
    container
    mx-auto
    ${ full ? 'h-screen' : 'h-2/4'}
    flex
    flex-col
    justify-center
    items-center
  `}>
    <h1 className={ `${ full ? 'text-mega' : 'text-9xl' } font-bold` }>WEDDINGFEST</h1>
    <h2 className={ `font-handwriting text-8xl ${ full ? 'py-20' : 'py-10'}` }>10 september 2022</h2>
    <Countdown
      date={new Date(2022, 7, 27)}
      renderer={CountdownTimer}
    />
  </div>
);

export default Header;