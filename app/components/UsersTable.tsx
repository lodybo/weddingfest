import type { SerializeFrom } from '@remix-run/server-runtime';
import type { Rsvp, User } from '@prisma/client';
import Button from '~/components/Button';
import Icon from '~/components/Icon';

type Props = {
  users: SerializeFrom<User & { rsvp: Rsvp | null }>[];
};

export default function UsersTable({ users }: Props) {
  return (
    <table className="w-full table-fixed border-2 border-slate-100 md:table-auto">
      <thead>
        <tr className="bg-stone-100">
          <th className="p-2.5 text-center sm:text-left">Naam</th>
          <th className="hidden p-2.5 text-left md:table-cell">E-mail</th>
          <th className="hidden p-2.5 text-left md:table-cell">Is admin</th>
          <th className="p-2.5 text-center sm:text-left">Acties</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr className="odd:bg-stone-50" key={user.id}>
            <td className="flex flex-col space-y-2 p-2.5">
              {user.name}
              <small className="text-xs text-gray-500 md:hidden">
                {user.email}
              </small>
            </td>
            <td className="hidden space-y-2 p-2.5 md:table-cell">
              {user.email}
            </td>
            <td className="hidden space-y-2 p-2.5 md:table-cell">
              {user.role === 'ADMIN' ? 'Ja' : 'Nee'}
            </td>
            <td className="table-cell p-2.5">
              <div className="flex flex-row flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="small"
                  to={`/admin/users/${user.id}/edit`}
                >
                  <Icon name="envelope" />
                </Button>

                <Button
                  variant="warning"
                  size="small"
                  to={`/admin/users/${user.id}/link`}
                >
                  <Icon name="link" />
                </Button>

                {user.rsvp ? (
                  <Button
                    variant="warning"
                    size="small"
                    to={`/admin/users/${user.id}/unlink`}
                  >
                    <Icon name="unlink" />
                  </Button>
                ) : null}

                {user.rsvp ? (
                  <Button size="small" to={`/admin/rsvp/edit/${user.rsvp.id}`}>
                    <Icon name="pencil" />
                  </Button>
                ) : null}

                <Button
                  variant="danger"
                  size="small"
                  to={`/admin/users/${user.id}/delete`}
                >
                  <Icon name="trash" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
