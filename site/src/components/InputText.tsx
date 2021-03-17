import React, { ChangeEvent } from 'react';
import classnames from 'classnames';

type InputTextProps = {
  name: string,
  value: string,
  changeHandler: (event: ChangeEvent) => void,
};

const InputText = ({
  name,
  value,
  changeHandler,
}: InputTextProps) => (
  <input
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
    )}
    type="text"
    name={name}
    value={value}
    onChange={changeHandler}
  />
);

export default InputText;