import { PassThrough } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import { Response } from '@remix-run/node';
import type { EntryContext, Headers } from '@remix-run/node';
import * as Sentry from '@sentry/remix';
import isbot from 'isbot';

const ABORT_DELAY = 5000;

Sentry.init({
  dsn: 'https://568225bed6b54f14a66cc6acbec32dd9:7a39e3db801a4d56af3394fc92db9b12@o268803.ingest.sentry.io/4505442718646272',
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1,
});

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]() {
          let body = new PassThrough();

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
          pipe(body);
        },
        onShellError(err: unknown) {
          reject(err);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
