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
    <p className="text-9xl">{ time }</p>
    <p className="text-5xl">{ label }</p>
  </div>
);

export default CountdownTimerItem;