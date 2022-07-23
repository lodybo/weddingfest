import { useState } from 'react';
import ToggleInput from '~/components/ToggleInput';
import type { ToggleOption } from '~/components/ToggleInput';

export default function AttendanceField() {
  const [selectedOption, setSelectedOption] = useState('');

  const attendanceOptions: ToggleOption[] = [
    { label: 'Ja', value: 'true', color: 'green' },
    { label: 'Nee', value: 'false' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <>
      <input type="hidden" name="attendance" value={selectedOption} />
      <p className="mb-2 text-center">Aanwezig</p>
      <ToggleInput
        name="attendance"
        options={attendanceOptions}
        onSelect={handleSelect}
      />
    </>
  );
}
