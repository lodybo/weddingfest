import React, { ChangeEvent } from 'react';
import classnames from 'classnames';

type InputTextAreaProps = {
  name: string,
  value: string,
  small?: boolean,
  changeHandler: (event: ChangeEvent) => void;
};

const InputTextArea = ({
  name,
  value,
  changeHandler,
  small,
}: InputTextAreaProps) => (
  <textarea
    className={classnames(
      'bg-primary-light',
      'p-2',
      'border',
      'border-solid',
      'border-black',
      'rounded-md',
      'text-base',
      'w-full',
      'sm:w-3/4',
      'md:w-2/4',
      {
        'h-12': small,
        'h-24': !small,
      },
    )}
    name={name}
    value={value}
    onChange={changeHandler}
  />
);

export default InputTextArea;