import type { ReactNode } from 'react';
import { useLocation } from '@remix-run/react';

import Navigation from '~/components/Navigation';
import Hero from '~/components/Hero';

import { useOptionalUser } from '~/utils/utils';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  const user = useOptionalUser();
  const location = useLocation();

  return (
    <div className="relative flex flex-col items-center justify-center">
      {!user ? (
        <Hero size={location.pathname === '/' ? 'large' : 'small'} />
      ) : (
        <div className="h-4" />
      )}
      <Navigation user={user} />

      {children}
    </div>
  );
}
