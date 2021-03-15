import React, { ChangeEvent } from 'react';

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
    className={`
      bg-primary-light
      p-2
      border
      border-solid
      border-black
      rounded-md
      text-base
      w-1/3
      ${small ? 'h-12' : 'h-24'}
    `}
    name={name}
    value={value}
    onChange={changeHandler}
  />
);

export default InputTextArea;