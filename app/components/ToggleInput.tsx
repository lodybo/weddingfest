import { useState } from 'react';

export interface ToggleOption {
  label: string;
  value: string;
  color?: 'green' | 'grey' | 'blue';
}

type Props = {
  name: string;
  options: ToggleOption[];
  onSelect: (selectedOption: string) => void;
  value?: string;
};

export default function ToggleInput({ options, name, onSelect, value }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>(value || '');

  const handleSelect = (selected: string) => {
    setSelectedOption(selected);
    onSelect(selected);
  };

  return (
    <span className="mb-10 flex flex-row items-center justify-center gap-5">
      {options.map(({ value, label, color = 'grey' }) => {
        const colorClass = `${
          color === 'green'
            ? value === selectedOption
              ? 'bg-emerald-300'
              : 'bg-zinc-200'
            : color === 'blue'
            ? value === selectedOption
              ? 'bg-cyan-300'
              : 'bg-zinc-200'
            : value === selectedOption
            ? 'bg-zinc-700 text-slate-50'
            : 'bg-zinc-200'
        } ${
          color === 'green'
            ? 'hover:bg-emerald-300'
            : color === 'blue'
            ? 'hover:bg-cyan-300'
            : 'hover:bg-zinc-700 hover:text-slate-50'
        }`;

        return (
          <button
            key={value}
            className={`${colorClass} px-8 py-2 transition focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`}
            name={name}
            value={value}
            type="button"
            onClick={() => handleSelect(value)}
          >
            {label}
          </button>
        );
      })}
    </span>
  );
}
