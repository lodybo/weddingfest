import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';

import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import Button from '~/components/Button';

import { createUserSession, getUserId } from '~/session.server';
import { verifyLogin } from '~/models/user.server';
import { safeRedirect, validateEmail } from '~/utils/utils';
import Anchor from '~/components/Anchor';
import PageLayout from '~/layouts/Page';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/admin');
  const remember = formData.get('remember');

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: 'Email is invalid' } },
      { status: 400 }
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json<ActionData>(
      { errors: { password: 'Password is required' } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: 'Password is too short' } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: 'Invalid email or password' } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on',
    redirectTo,
  });
};

export const meta: V2_MetaFunction = () => [
  {
    title: 'Login',
  },
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const actionData = useActionData() as ActionData;

  return (
    <PageLayout>
      <Form method="post" className="w-full max-w-md space-y-6 px-8" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <EmailInput
              id="email"
              required
              autoFocus={true}
              name="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
            />
            {actionData?.errors?.email && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button className="w-full" variant="primary" type="submit">
          Inloggen
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Onthoud mij
            </label>
          </div>
          <div className="text-center text-sm text-gray-500">
            Wachtwoord vergeten?{' '}
            <Anchor
              to={{
                pathname: '/reset-password',
              }}
            >
              Klik hier
            </Anchor>
          </div>
        </div>
      </Form>
    </PageLayout>
  );
}
