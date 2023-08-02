import type { LoaderArgs } from '@remix-run/node';
import { requireAdmin } from '~/session.server';
import { getAllUsers } from '~/models/user.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import UsersTable from '~/components/UsersTable';

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const users = await getAllUsers({ includeRsvps: true });

  return json({ users });
}

export default function AdminUsers() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-5xl">Gebruikers</h1>

      <UsersTable users={users} />
    </div>
  );
}
