import { useState } from 'react';
import type { ToggleOption } from '~/components/ToggleInput';
import ToggleInput from '~/components/ToggleInput';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  value?: boolean;
  error?: string;
  onChange?: (value: boolean) => void;
};

export default function CampingField({ value, error, onChange }: Props) {
  const [selectedOption, setSelectedOption] = useState(
    JSON.stringify(value) || ''
  );

  const options: ToggleOption[] = [
    { label: 'Ja', value: 'true', color: 'blue' },
    { label: 'Nee', value: 'false' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option === 'true');
    }
  };

  return (
    <div className="w-full">
      <input type="hidden" name="camping" defaultValue={selectedOption} />
      <p className="mb-2 text-center text-gray-700">Blijf je slapen?</p>
      <ToggleInput
        name="camping"
        options={options}
        onSelect={handleSelect}
        value={selectedOption}
      />
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
