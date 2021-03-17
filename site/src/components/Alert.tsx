import React from 'react';
import classnames from 'classnames';

export enum ALERT_STATES {
  HIDDEN,
  ERROR,
  SUCCESS,
}

type Props = {
  state: ALERT_STATES,
  message: string,
};

const Alert = ({
  state = ALERT_STATES.HIDDEN,
  message,
}: Props) => (
  <div className={classnames(
    {
      'flex': state !== ALERT_STATES.HIDDEN,
      'hidden': state === ALERT_STATES.HIDDEN,
    },
    'my-10',
    'py-5',
    'px-10',
    'border-4',
    'border-solid',
    {
      'border-primary-dark': state === ALERT_STATES.SUCCESS,
      'bg-primary': state === ALERT_STATES.SUCCESS,
    },
    {
      'border-secondary-dark': state === ALERT_STATES.ERROR,
      'bg-secondary': state === ALERT_STATES.ERROR,
    }
  )}>
    { message }
  </div>
);

export default Alert;