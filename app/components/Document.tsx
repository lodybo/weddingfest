import type { ReactNode } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

type Props = {
  children: ReactNode;
};

export default function Document({ children }: Props) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={4200} />
      </body>
    </html>
  );
}
