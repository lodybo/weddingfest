import React, { ChangeEvent } from 'react';

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
    className="
      bg-primary-light
      p-2
      border
      border-solid
      border-black
      rounded-md
      text-base
      w-1/3
    "
    type="text"
    name={name}
    value={value}
    onChange={changeHandler}
  />
);

export default InputText;