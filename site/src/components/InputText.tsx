import React from 'react';

type InputTextProps = {
  name: string,
  value: string,
};

const InputText = ({
  name,
  value,
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
    value={value} />
);

export default InputText;