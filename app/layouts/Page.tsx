import type { ReactNode } from 'react';

import Navigation from '~/components/Navigation';
import Hero from '~/components/Hero';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation />
      <Hero />

      {children}
    </div>
  );
}
