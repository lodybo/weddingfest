import type { ReactNode } from 'react';

import Navigation from '~/components/Navigation';
import Hero from '~/components/Hero';

import { useOptionalUser } from '~/utils';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  const user = useOptionalUser();

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation user={user} />
      { !user ? (
        <Hero />
      ) : (
        <div className="h-4" />
      )}

      {children}
    </div>
  );
}
