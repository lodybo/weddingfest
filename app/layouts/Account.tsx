import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AccountLayout({ children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-4" />
      <div className="flex w-full max-w-2xl flex-col items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
