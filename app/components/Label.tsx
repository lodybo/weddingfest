import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
};

export default function Label({ label, children }: Props) {
  return (
    <label className="mb-5 w-full">
      <p className="mb-2 text-center">{label}</p>

      {children}
    </label>
  );
}
