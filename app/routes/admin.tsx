import { json, redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
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
      <div className="flex w-full flex-row">
        <div className="flex-none w-1/4 px-4">
          <h2 className="text-2xl mb-2">Menu</h2>
          <Link className="border-b-2 border-b-cyan-200 pb-0.5 hover:pb-1.5 transition-all" to="/join">
            Account registreren
          </Link>
        </div>

        <div className="flex-none w-3/4 px-4">
          <h1>Hallo { user.email }</h1>
        </div>
      </div>
    </PageLayout>
  );
}
