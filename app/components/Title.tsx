import type { ReactNode } from 'react';

export default function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="mb-grow-x text-center font-handwriting text-hero leading-10 sm:leading-[0.8]">
      {children}
    </h1>
  );
}
