import type { ReactNode } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react';
import { useMatchesData, useOptionalUser } from '~/utils/utils';
import type { LoaderData } from '~/root';
import type { MenuItem } from '~/components/Navigation';
import Footer from '~/components/Footer';

type Props = {
  children: ReactNode;
};

export default function Document({ children }: Props) {
  const user = useOptionalUser();
  const location = useLocation();
  const data = useMatchesData('root');

  let menuItems: MenuItem[] = [];
  if (data?.menuItems) {
    menuItems = data.menuItems as MenuItem[];
  }

  const { ENV } = (data as LoaderData) || {};

  const isLoggedInPage =
    location.pathname.startsWith('/account') ||
    location.pathname.startsWith('/admin');

  return (
    <html lang="en" className="h-full">
      <head>
        <script
          defer
          data-domain="weddingfest.nl"
          src="https://plausible.io/js/script.js"
        ></script>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <meta name="theme-color" content="#cffafe" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full font-sans">
        <div className="relative flex min-h-full flex-col items-center justify-center">
          {children}

          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <LiveReload port={4200} />
      </body>
    </html>
  );
}
