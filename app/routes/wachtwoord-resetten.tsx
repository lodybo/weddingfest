import * as React from 'react';
import { redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import type { ActionFunction, V2_MetaFunction } from '@remix-run/node';
import sanitizeHtml from 'sanitize-html';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';

import { safeRedirect } from '~/utils/utils';

import { changeUserPassword } from '~/models/user.server';
import { PasswordResetForm } from '~/components/PasswordResetForm';
import { validateResetPasswordForm } from '~/validations/auth';

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  // TODO: Add CSRF protection, and integrate Sentry.
  const formData = await request.formData();
  const formDataEmail = formData.get('email');
  const formDataPassword = formData.get('password');
  const formDataVerifyPassword = formData.get('verifyPassword');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/inloggen');

  invariant(typeof formDataEmail === 'string', 'Email is required');
  invariant(typeof formDataPassword === 'string', 'Password is required');
  invariant(
    typeof formDataVerifyPassword === 'string',
    'Verify password is required'
  );

  const email = sanitizeHtml(formDataEmail);
  const password = sanitizeHtml(formDataPassword);
  const verifyPassword = sanitizeHtml(formDataVerifyPassword);

  const errors = validateResetPasswordForm({ email, password, verifyPassword });

  if (errors) {
    return badRequest({ errors });
  }

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
    <>
      <PasswordResetForm errors={actionData?.errors} />
    </>
  );
}
