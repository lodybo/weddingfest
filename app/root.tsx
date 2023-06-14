import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { isRouteErrorResponse, Outlet, useRouteError } from '@remix-run/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSquarePlus,
  faSquareMinus,
  faTrash,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import tailwindStylesheetUrl from './tailwind.css';

import { getUser } from './session.server';
import Document from '~/components/Document';
import { getErrorMessage } from '~/utils';

library.add(faSquarePlus, faSquareMinus, faTrash, faPenToSquare);

export const links: LinksFunction = () => {
  return [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap',
    },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
  ];
};

export const meta: V2_MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'Weddingfest 2022',
    viewport: 'width=device-width,initial-scale=1',
    'msapplication-TileColor': '#00aba9',
    'theme-color': '#ffffff',
  },
];

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = 'Oeps...';
  let message: string;

  if (isRouteErrorResponse(error)) {
    console.error(error.data.message);
    title = 'Oh nee!';
    message = error.data.message;
  } else {
    message = getErrorMessage(error);
    console.error(message);
    if (error instanceof Error) {
      console.trace(error.stack);
    }
  }

  return (
    <Document>
      <div className="flex h-full w-full place-content-center place-items-center">
        <div>
          <h1 className="text-center font-handwriting text-7xl">{title}</h1>
          <p className="text-xl">{message}</p>
        </div>
      </div>
    </Document>
  );
}
