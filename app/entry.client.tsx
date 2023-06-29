import * as React from 'react';
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: 'https://568225bed6b54f14a66cc6acbec32dd9:7a39e3db801a4d56af3394fc92db9b12@o268803.ingest.sentry.io/4505442718646272',
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/staging\.weddingfest\.nl/,
        /^https:\/\/weddingfest\.nl/,
      ],
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        React.useEffect,
        useLocation,
        useMatches
      ),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: window.ENV.ENVIRONMENT === 'production' ? 0.5 : 1,
  // Session Replay
  replaysSessionSampleRate: window.ENV.ENVIRONMENT === 'production' ? 0.1 : 1,
  replaysOnErrorSampleRate: 1.0,
});

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <RemixBrowser />
      </React.StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
