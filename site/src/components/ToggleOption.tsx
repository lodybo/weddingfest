import React, { ChangeEvent } from 'react';

type ToggleOptionProps = {
  name: string,
  isChecked: boolean,
  value: string,
  caption: string,
  primary?: boolean,
  changeHandler: (event: ChangeEvent) => void;
};

const ToggleOption = ({
  name,
  isChecked,
  caption,
  value,
  primary,
  changeHandler,
}: ToggleOptionProps) => (
  <label
    className={`
      inline-block
      border
      transition
      px-5
      py-2.5
      cursor-pointer
      ${primary ? `
        border-primary-dark
        hover:bg-primary-dark
        ${isChecked ? `
          bg-primary-dark
        `: `
          bg-primary
        `}
      ` : `
        border-secondary-dark
        hover:bg-secondary-dark
        ${isChecked ? `
          bg-secondary-dark
        `: `
          bg-secondary
        `}
      `}
    `}
  >
    <input
      className="
        appearance-none
      "
      type="radio"
      required
      name={name}
      value={value}
      checked={isChecked}
      onChange={changeHandler}
    />
    { caption }
  </label>
);

export default ToggleOption;