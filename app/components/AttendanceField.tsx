import { useState, useEffect } from 'react';
import ToggleInput from '~/components/ToggleInput';
import type { ToggleOption } from '~/components/ToggleInput';

type Props = {
  value?: boolean;
};

export default function AttendanceField({ value }: Props) {
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value ? 'true' : 'false');
    }
  }, [value]);

  const attendanceOptions: ToggleOption[] = [
    { label: 'Ja', value: 'true', color: 'green' },
    { label: 'Nee', value: 'false' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <>
      <input type="hidden" name="attendance" defaultValue={selectedOption} />
      <p className="mb-2 text-center">Aanwezig</p>
      <ToggleInput
        name="attendance"
        options={attendanceOptions}
        onSelect={handleSelect}
        value={selectedOption}
      />
    </>
  );
}
