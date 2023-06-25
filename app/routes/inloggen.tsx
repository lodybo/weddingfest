import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import { createUserSession, getUserId } from '~/session.server';
import { verifyLogin } from '~/models/user.server';
import { safeRedirect } from '~/utils/utils';
import PageLayout from '~/layouts/Page';
import { LoginForm } from '~/components/LoginForm';
import { validateLoginForm } from '~/validations/auth';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';

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
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember');
  let redirectTo = safeRedirect(formData.get('redirectTo'), '/account');

  const errors = validateLoginForm({ email, password });

  if (errors) {
    return badRequest({ errors });
  }

  invariant(typeof email === 'string', 'Email is required');
  invariant(typeof password === 'string', 'Password is required');

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      {
        errors: {
          email:
            'Deze combinatie van e-mailadres en wachtwoord is niet bekend.',
        },
      },
      { status: 400 }
    );
  }

  if (user.role === 'ADMIN') {
    redirectTo = '/admin';
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on',
    redirectTo,
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
    <PageLayout>
      <LoginForm errors={actionData?.errors} />
    </PageLayout>
  );
}
