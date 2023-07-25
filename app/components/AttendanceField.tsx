import { useRef, useState } from 'react';
import type { ATTENDANCE } from '@prisma/client';
import ToggleInput from '~/components/ToggleInput';
import type { ToggleOption } from '~/components/ToggleInput';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  value?: ATTENDANCE;
  error?: string;
  onChange?: (value: ATTENDANCE) => void;
};

export default function AttendanceField({ value, error, onChange }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>(value ?? '');

  const attendanceOptions: ToggleOption[] = [
    { label: 'Ja, de hele dag', value: 'ALL_DAY', color: 'green' },
    { label: "Ja, alleen 's avonds", value: 'EVENING', color: 'blue' },
    { label: 'Nee', value: 'NONE' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option as ATTENDANCE);
    }
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
