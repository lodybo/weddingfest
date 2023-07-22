import type { SerializeFrom } from '@remix-run/server-runtime';
import type { Page } from '@prisma/client';
import Button from '~/components/Button';
import Icon from '~/components/Icon';
import Anchor from '~/components/Anchor';

type Props = {
  pages: SerializeFrom<Page>[];
};

export default function PagesTable({ pages }: Props) {
  return (
    <table className="w-full table-fixed border-2 border-slate-100">
      <thead>
        <tr className="bg-stone-100">
          <th className="p-2.5 text-center sm:text-left">Titel</th>
          <th className="p-2.5 text-center sm:text-left">Acties</th>
        </tr>
      </thead>
      <tbody>
        {pages.length === 0 ? (
          <tr>
            <td className="p-2.5 text-center" colSpan={2}>
              Er zijn nog geen pagina's.{' '}
              <Anchor to="/admin/pages/new">Maak een nieuwe pagina aan.</Anchor>
            </td>
          </tr>
        ) : (
          pages.map((page) => (
            <tr className="odd:bg-stone-50" key={page.id}>
              <td className="space-y-2 p-2.5">
                {page.title}
                {page.published ? null : (
                  <span className="text-xs text-gray-500"> (concept)</span>
                )}
              </td>
              <td className="flex flex-row gap-2 p-2.5">
                <Button size="small" to={`/admin/pages/edit/${page.slug}`}>
                  <Icon name="pen-to-square" />
                </Button>
                <Button size="small" to={`/admin/pages/delete/${page.slug}`}>
                  <Icon name="trash" />
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
