import React from 'react';

type ToggleOptionProps = {
  name: string,
  attendance: boolean | null,
  value: string,
  caption: string,
  primary?: boolean,
};

const ToggleOption = ({
  name,
  attendance,
  caption,
  value,
  primary
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