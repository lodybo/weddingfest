import React from 'react';

type CountdownTimerItemProps = {
  time: number;
  label: string;
};

const CountdownTimerItem = ({
  time,
  label,
}: CountdownTimerItemProps) => (
  <div className="
    flex
    flex-col
    items-center
  ">
    <p className="
      text-4xl
      md:text-6xl
      lg:text-8xl
      2xl:text-9xl
    ">{ time }</p>
    <p className="
      text-lg
      md:text-2xl
      lg:text-4xl
      2xl:text-5xl
    ">{ label }</p>
  </div>
);

export default CountdownTimerItem;