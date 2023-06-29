import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import type { ActionFunction, V2_MetaFunction } from '@remix-run/node';

import { safeRedirect, validateEmail } from '~/utils/utils';

import { getUserByEmail, changeUserPassword } from '~/models/user.server';
import * as React from 'react';
import PageLayout from '~/layouts/Page';
import { PasswordResetForm } from '~/components/PasswordResetForm';
import { validateResetPasswordForm } from '~/validations/auth';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  // TODO: Add CSRF protection, and integrate Sentry.
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const verifyPassword = formData.get('verifyPassword');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/inloggen');

  const errors = validateResetPasswordForm({ email, password, verifyPassword });

  if (errors) {
    return badRequest({ errors });
  }

  invariant(typeof email === 'string', 'Email is required');
  invariant(typeof password === 'string', 'Password is required');

  const user = await changeUserPassword(email, password);

  if (!user) {
    return badRequest({ errors: { email: 'Gebruiker niet gevonden' } });
  }

  return redirect(redirectTo);
};

export const meta: V2_MetaFunction = () => [
  {
    title: 'Verander wachtwoord',
  },
];

export default function ResetPasswordPage() {
  const actionData = useActionData<ActionData>();

  return (
    <PageLayout>
      <PasswordResetForm errors={actionData?.errors} />
    </PageLayout>
  );
}
