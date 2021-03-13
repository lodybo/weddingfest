import React from 'react';
import { CountdownRenderProps } from 'react-countdown';
import CountdownTimerItem from './CountdownTimerItem';

const CountdownTimer = ({
  days,
  hours,
  minutes,
  seconds,
}: CountdownRenderProps) => (
  <div className="flex justify-between w-3/4">
    <CountdownTimerItem time={ days } label="dagen" />
    <CountdownTimerItem time={ hours } label="uren" />
    <CountdownTimerItem time={ minutes } label="minuten" />
    <CountdownTimerItem time={ seconds } label="seconden" />
  </div>
);

export default CountdownTimer;