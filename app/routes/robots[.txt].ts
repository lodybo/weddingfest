import { txt } from 'remix-utils';

export function loader() {
  return txt(`
    User-agent: *
    Disallow: /
  `);
}
