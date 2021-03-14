import React from 'react';
import ToggleOption from './ToggleOption';

export type InputToggleProps = {
  name: string,
  attendance: boolean | null,
};

const InputToggle = ({
  name,
  attendance,
}: InputToggleProps) => (
  <div className="space-x-2">
    <ToggleOption
      caption={"Ik kom niet"}
      value={"false"}
      name={name}
      attendance={attendance === false}
    />

    <ToggleOption
      caption={"Ik ben erbij"}
      value={"true"}
      name={name}
      attendance={attendance === true}
      primary
    />
  </div>
);

export default InputToggle;