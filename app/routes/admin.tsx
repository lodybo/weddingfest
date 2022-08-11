import { json, redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import PageLayout from '~/layouts/Page';

import { getUserId } from '~/session.server';
import { useUser } from '~/utils';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/");
  return json({});
};

export default function AdminPage() {
  const user = useUser();

  return (
    <PageLayout>
      <h1>Hallo { user.email }</h1>
    </PageLayout>
  );
}
