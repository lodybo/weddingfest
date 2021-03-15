import React, { ChangeEvent } from 'react';
import ToggleOption from './ToggleOption';

export type InputToggleProps = {
  name: string,
  isChecked: string,
  captionWhenTrue: string,
  captionWhenFalse: string,
  changeHandler: (event: ChangeEvent) => void,
};

const InputToggle = ({
  name,
  isChecked,
  captionWhenTrue,
  captionWhenFalse,
  changeHandler,
}: InputToggleProps) => (
  <div className="space-x-2">
    <ToggleOption
      caption={captionWhenFalse}
      value={"false"}
      name={name}
      isChecked={isChecked === 'false'}
      changeHandler={changeHandler}
    />

    <ToggleOption
      caption={captionWhenTrue}
      value={"true"}
      name={name}
      isChecked={isChecked === 'true'}
      changeHandler={changeHandler}
      primary
    />
  </div>
);

export default InputToggle;