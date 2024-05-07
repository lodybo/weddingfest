import type { ReactNode } from 'react';

export default function Subtitle({ children }: { children: ReactNode }) {
  return <p className="text-center text-resp leading-tight">{children}</p>;
}
