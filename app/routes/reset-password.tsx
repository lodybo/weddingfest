import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import type { ActionFunction, MetaFunction } from '@remix-run/node';

import Button from '~/components/Button';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';

import { safeRedirect, validateEmail } from '~/utils';

import { getUserByEmail, changeUserPassword } from '~/models/user.server';
import * as React from 'react';

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/login");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return json<ActionData>(
      { errors: { email: "No user found with this email" } },
      { status: 400 }
    );
  }

  const user = await changeUserPassword(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return redirect(redirectTo);
};

export const meta: MetaFunction = () => {
  return {
    title: "Verander wachtwoord",
  };
};

export default function ResetPasswordPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mailadres
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
              Nieuw wachtwoord
            </label>
            <div className="mt-1">
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
            </div>
          </div>

          <div>
            <div className="mt-1">
              <label
                htmlFor="verify-password"
                className="block text-sm font-medium text-gray-700"
              >
                Voer nogmaals het nieuwe wachtwoord in
              </label>
              <PasswordInput
                id="verified-password"
                name="verified-password"
                autoComplete="new-password"
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

          <div className="flex flex-row justify-between">
            <Link to="/login">
              <Button
                variant="normal"
                type="submit"
              >
                Terug
              </Button>
            </Link>

            <Button
              variant="primary"
              type="submit"
            >
              Verander wachtwoord
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
