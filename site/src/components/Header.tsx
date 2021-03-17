import React from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown';
import CountdownTimer from './CountdownTimer';

type HeaderProps = {
  full?: boolean,
};

const Header = ({
  full = false,
}: HeaderProps) => (
  <div className={ classnames(
    'container',
    'mx-auto',
    {
      'h-screen': full,
      'h-2/4': !full,
    },
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
  )}>
    <h1 className={classnames(
      'text-5xl',
      'md:text-7xl',
      'lg:text-9xl',
      '2xl:text-12xl',
      'font-bold',
      'pt-20'
    )}>
      WEDDINGFEST
    </h1>

    <h2 className={classnames(
      'font-handwriting',
      'text-5xl',
      'md:text-8xl',
      '2xl:text-10xl',
      {
        'py-14': full,
        'lg:py-20': full,
        'py-10': !full,
      })}
    >
      27 augustus 2022
    </h2>

    <Countdown
      date={new Date(2022, 7, 27)}
      renderer={CountdownTimer}
    />
  </div>
);

export default Header;