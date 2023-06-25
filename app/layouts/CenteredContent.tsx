import type { ReactNode } from 'react';
import { useLocation } from '@remix-run/react';

import Navigation from '~/components/Navigation';
import Hero from '~/components/Hero';

import { useOptionalUser } from '~/utils/utils';
import Footer from '~/components/Footer';

type Props = {
  children: ReactNode;
};

export default function CenteredContentLayout({ children }: Props) {
  const user = useOptionalUser();
  const location = useLocation();

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center">
      <Navigation user={user} />
      <Hero size={location.pathname === '/' ? 'large' : 'small'} />

      <div className="flex flex-1 flex-col place-content-center place-items-center gap-4">
        {children}
      </div>

      <Footer />
    </div>
  );
}
