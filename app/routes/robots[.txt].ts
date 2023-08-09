import { json } from '@remix-run/node';

export function loader() {
  const body = `
User-agent: *
Disallow: /
  `;

  return json(body, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
