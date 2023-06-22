import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';

import {
  coupleRsvpToUser,
  createUser,
  getUserByEmail,
} from '~/models/user.server';
import PageLayout from '~/layouts/Page';
import { RegisterForm } from '~/components/RegisterForm';
import { validateRegistrationForm } from '~/validations/auth';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';
import { createUserSession } from '~/session.server';

export interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    user?: string;
  };
  success?: {
    user?: string;
  };
  data?: {
    name?: string;
    email?: string;
    password?: string;
  };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const verifyPassword = formData.get('verifyPassword');
  const rsvp = formData.get('rsvp');

  const errors = validateRegistrationForm({
    name,
    email,
    password,
    verifyPassword,
  });

  if (errors) {
    console.log({ errors, data: { name, email, password, verifyPassword } });
    return badRequest({ errors, data: { email, password } });
  }

  invariant(typeof name === 'string', 'Name is required');
  invariant(typeof email === 'string', 'Email is required');
  invariant(typeof password === 'string', 'Password is required');

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      {
        errors: { email: 'Er bestaat al een account met dit e-mailadres.' },
        data: { name, email, password },
      },
      { status: 400 }
    );
  }

  const user = await createUser(name, email, password);

  console.log({ rsvp, user });
  if (rsvp && typeof rsvp === 'string') {
    await coupleRsvpToUser(user.id, rsvp);
  }

  if (!user) {
    return json<ActionData>(
      {
        errors: {
          user: 'Er is iets fout gegaan met het aanmaken van de gebruiker.',
        },
        data: { name, email, password },
      },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: '/account',
  });
}

export const meta: V2_MetaFunction = () => [
  {
    title: 'Account aanmaken',
  },
];

export default function Aanmelden() {
  const actionData = useActionData() as ActionData;

  return (
    <PageLayout>
      <RegisterForm
        errors={actionData?.errors}
        success={actionData?.success}
        data={actionData?.data}
      />
    </PageLayout>
  );
}
