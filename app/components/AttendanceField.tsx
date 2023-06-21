import { useState, useEffect } from 'react';
import ToggleInput from '~/components/ToggleInput';
import type { ToggleOption } from '~/components/ToggleInput';
import ErrorMessage from '~/components/ErrorMessage';
import type { ATTENDANCE } from '@prisma/client';

type Props = {
  value?: ATTENDANCE;
  error?: string;
};

export default function AttendanceField({ value, error }: Props) {
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value ? 'true' : 'false');
    }
  }, [value]);

  const attendanceOptions: ToggleOption[] = [
    { label: 'Ja, de hele dag', value: 'ALL_DAY', color: 'green' },
    { label: "Ja, alleen 's avonds", value: 'EVENING', color: 'blue' },
    { label: 'Nee', value: 'NONE' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-full">
      <input type="hidden" name="attendance" defaultValue={selectedOption} />
      <p className="mb-2 text-center text-gray-700">
        Zijn jullie die dag aanwezig?
      </p>
      <ToggleInput
        name="attendance"
        options={attendanceOptions}
        onSelect={handleSelect}
        value={selectedOption}
      />
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
