import React from 'react';
import slugify from '@sindresorhus/slugify';
import InputToggle from './InputToggle';

export type RSVPGuestProps = {
  id: string,
  name: string;
  attendance: boolean;
  remarks: string;
};

const RSVPGuest = ({
  id,
  name,
  attendance,
  remarks,
}: RSVPGuestProps) => (
  <div>
    <div className="flex justify-between">
      <p>{ name }</p>
      <InputToggle name={`attendance-${slugify(name)}`} attendance={attendance} />
    </div>
  </div>
);

export default RSVPGuest;