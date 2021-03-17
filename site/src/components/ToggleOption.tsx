import React, { ChangeEvent } from 'react';
import classnames from 'classnames';

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
    className={classnames(
      'inline-block',
      'border',
      'transition',
      'px-5',
      'py-2.5',
      'cursor-pointer',
      {
        'border-primary-dark': primary,
        'hover:bg-primary-dark': primary,
        'bg-primary-dark': primary && isChecked,
        'bg-primary': primary && !isChecked,
      },
      {
        'border-secondary-dark': !primary,
        'hover:bg-secondary-dark': !primary,
        'bg-secondary-dark': !primary && isChecked,
        'bg-secondary': !primary && !isChecked,
      },
    )}
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