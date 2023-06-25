import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUser } from '~/session.server';
import AccountLayout from '~/layouts/Account';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AccountLayout>
      <h1>{user.email}</h1>
    </AccountLayout>
  );
}
