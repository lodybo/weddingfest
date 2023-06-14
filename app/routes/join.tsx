import type { ActionFunction, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';

import Button from '~/components/Button';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import Anchor from '~/components/Anchor';

import { createUser, getUserByEmail } from '~/models/user.server';
import { validateEmail } from '~/utils/utils';
import PageLayout from '~/layouts/Page';

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    user?: string;
  };
  success?: {
    user?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

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

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: 'A user already exists with this email' } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { user: 'Something went wrong when creating the user.' } },
      { status: 400 }
    );
  }

  return json<ActionData>(
    {
      success: {
        user: `User ${user.email} has been created.`,
      },
    },
    {
      status: 200,
    }
  );
};

export const meta: V2_MetaFunction = () => [
  {
    title: 'Opgeven',
  },
];

export default function Join() {
  const actionData = useActionData() as ActionData;

  return (
    <PageLayout>
      <Form method="post" className="w-full max-w-md space-y-6 px-8" noValidate>
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
            Wachtwoord
          </label>
          <div className="mt-1">
            <PasswordInput
              id="password"
              name="password"
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

        <div className="flex flex-row justify-end gap-10">
          <Button type="submit" variant="primary">
            Account aanmaken
          </Button>
        </div>

        {actionData?.errors?.user && <p>{actionData.errors.user}</p>}

        {actionData?.success?.user && <p>{actionData.success.user}</p>}
      </Form>
    </PageLayout>
  );
}
