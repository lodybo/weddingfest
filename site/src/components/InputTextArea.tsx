import React from 'react';

type InputTextAreaProps = {
  name: string,
  value: string,
  small?: boolean,
};

const InputTextArea = ({
  name,
  value,
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
  >{value}</textarea>
);

export default InputTextArea;