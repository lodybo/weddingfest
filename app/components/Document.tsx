import type { ReactNode } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useMatchesData } from '~/utils/utils';
import type { LoaderData } from '~/root';

type Props = {
  children: ReactNode;
};

export default function Document({ children }: Props) {
  const data = useMatchesData('root');

  const { ENV } = (data as LoaderData) || {};

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <Meta />
        <Links />
      </head>
      <body className="h-full font-sans">
        {children}
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
