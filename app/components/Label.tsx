import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  flex?: boolean;
};

export default function Label({ label, children, flex = false }: Props) {
  return (
    <label
      className={`inline-block w-full ${
        flex ? 'flex flex-col items-center gap-2 sm:flex-row' : ''
      }`}
    >
      <p className={`text-left text-gray-700 ${flex ? 'mb-0 flex-1' : 'mb-2'}`}>
        {label}
      </p>
      {children}
    </label>
  );
}
