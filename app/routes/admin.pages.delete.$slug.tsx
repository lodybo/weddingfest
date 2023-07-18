import type { LoaderArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import invariant from 'tiny-invariant';
import { deletePageBySlug } from '~/models/pages.server';
import Anchor from '~/components/Anchor';

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);

  const slug = params.slug;
  invariant(slug, 'De slug is niet ingevuld');

  await deletePageBySlug(slug);

  return null;
}

export default function AdminPagesDelete() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="font-handwriting text-5xl">Pagina verwijderd</h1>
      <Anchor to="/admin/pages">Terug naar overzicht</Anchor>
    </div>
  );
}
