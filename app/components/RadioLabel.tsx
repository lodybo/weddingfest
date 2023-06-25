import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
};

export default function RadioLabel({ label, children }: Props) {
  return (
    <label className="flex flex-row items-center justify-start gap-2">
      {children}
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
