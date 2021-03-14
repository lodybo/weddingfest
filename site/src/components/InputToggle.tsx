import React from 'react';
import ToggleOption from './ToggleOption';

export type InputToggleProps = {
  name: string,
  attendance: boolean | null,
  captionWhenTrue: string,
  captionWhenFalse: string,
};

const InputToggle = ({
  name,
  attendance,
  captionWhenTrue,
  captionWhenFalse,
}: InputToggleProps) => (
  <div className="space-x-2">
    <ToggleOption
      caption={captionWhenFalse}
      value={"false"}
      name={name}
      attendance={attendance === false}
    />

    <ToggleOption
      caption={captionWhenTrue}
      value={"true"}
      name={name}
      attendance={attendance === true}
      primary
    />
  </div>
);

export default InputToggle;