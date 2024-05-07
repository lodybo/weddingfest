import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import { allowAccess, createUserSession, getUserId } from '~/session.server';
import { verifyLogin } from '~/models/user.server';
import { safeRedirect } from '~/utils/utils';
import { LoginForm } from '~/components/LoginForm';
import { validateLoginForm } from '~/validations/auth';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';
import sanitizeHtml from 'sanitize-html';
import SpeakeasyForm from '~/components/SpeakeasyForm';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/nagenieten');

  if (password === 'Weddingfest 2023') {
    return allowAccess({ request, redirectTo });
  }

  return badRequest({
    errors: {
      password: 'Het toegangswoord is onjuist.',
    },
  });
}

export const meta: V2_MetaFunction = () => [
  {
    title: 'Inloggen',
  },
];

export default function LoginPage() {
  const actionData = useActionData() as ActionData;

  return (
    <>
      <SpeakeasyForm errors={actionData?.errors} />
    </>
  );
}
