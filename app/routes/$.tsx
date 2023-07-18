import type { LoaderArgs } from '@remix-run/node';
import { getPageBySlug } from '~/models/pages.server';
import { notFound } from 'remix-utils';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Prose from '~/components/Prose';

export async function loader({ params }: LoaderArgs) {
  const slug = params['*'];

  if (!slug) {
    throw notFound({});
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    throw notFound({});
  }

  return json({ page });
}

export default function ContentPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <Prose>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </Prose>
  );
}
