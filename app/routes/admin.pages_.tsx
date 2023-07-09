import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/session.server';
import { getAllPages } from '~/models/pages.server';
import PagesTable from '~/components/PagesTable';
import Button from '~/components/Button';
import Icon from '~/components/Icon';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const pages = await getAllPages();

  return json({ pages });
}

export default function AdminContentPagesListRoute() {
  const { pages } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="font-handwriting text-5xl">Pagina's</h1>

        <Button
          className="flex flex-row gap-2"
          variant="primary"
          size="small"
          to="/admin/pages/new"
        >
          <Icon name="plus" /> Nieuwe pagina
        </Button>
      </div>

      <PagesTable pages={pages} />
    </div>
  );
}
