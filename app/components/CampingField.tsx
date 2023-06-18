import { useState } from 'react';
import type { ToggleOption } from '~/components/ToggleInput';
import ToggleInput from '~/components/ToggleInput';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  value?: boolean;
  error?: string;
};

export default function CampingField({ value, error }: Props) {
  const [selectedOption, setSelectedOption] = useState(
    JSON.stringify(value) || ''
  );

  const options: ToggleOption[] = [
    { label: 'Ja', value: 'true', color: 'blue' },
    { label: 'Nee', value: 'false', color: 'blue' },
  ];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
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
