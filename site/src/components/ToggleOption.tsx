import React from 'react';
import { InputToggleProps } from './InputToggle';

type ToggleOptionProps = {
  value: string,
  caption: string,
  primary?: boolean,
} & InputToggleProps;

const ToggleOption = ({
  name,
  attendance,
  caption,
  value,
  primary
}: ToggleOptionProps) => (
  <label
    className={`
      border
      transition
      px-5
      py-2.5
      cursor-pointer
      ${primary ? `
        border-primary-dark
        hover:bg-primary-dark
        ${attendance ? `
          bg-primary-dark
        `: `
          bg-primary
        `}
      ` : `
        border-secondary-dark
        hover:bg-secondary-dark
        ${attendance ? `
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
      checked={attendance}
    />
    { caption }
  </label>
);

export default ToggleOption;