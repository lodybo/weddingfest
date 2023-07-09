import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { badRequest } from 'remix-utils';
import invariant from 'tiny-invariant';
import * as Sentry from '@sentry/remix';
import sanitizeHtml from 'sanitize-html';
import type { User } from '@prisma/client';
import {
  coupleRsvpToUser,
  createUser,
  getUserByEmail,
} from '~/models/user.server';
import { RegisterForm } from '~/components/RegisterForm';
import { validateRegistrationForm } from '~/validations/auth';
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
  const formDataName = formData.get('name');
  const formDataEmail = formData.get('email');
  const formDataPassword = formData.get('password');
  const formDataVerifyPassword = formData.get('verifyPassword');
  const rsvp = formData.get('rsvp');

  invariant(typeof formDataName === 'string', 'Name is required');
  invariant(typeof formDataEmail === 'string', 'Email is required');
  invariant(typeof formDataPassword === 'string', 'Password is required');
  invariant(
    typeof formDataVerifyPassword === 'string',
    'Verify password is required'
  );

  const name = sanitizeHtml(formDataName);
  const email = sanitizeHtml(formDataEmail);
  const password = sanitizeHtml(formDataPassword);
  const verifyPassword = sanitizeHtml(formDataVerifyPassword);

  const errors = validateRegistrationForm({
    name,
    email,
    password,
    verifyPassword,
  });

  if (errors) {
    Sentry.captureException({
      errors,
      data: { email, password },
    });
    return badRequest({
      errors,
      data: { email, password },
    });
  }

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

  let user: User | undefined;
  try {
    user = await createUser(name, email, password);
  } catch (error) {
    Sentry.captureException(error);
  }

  if (!user) {
    Sentry.captureMessage('Failed to create user');
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

  if (rsvp && typeof rsvp === 'string') {
    try {
      await coupleRsvpToUser(user.id, rsvp);
    } catch (error) {
      Sentry.captureException(error);
    }
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
    <>
      <RegisterForm
        errors={actionData?.errors}
        success={actionData?.success}
        data={actionData?.data}
      />
    </>
  );
}
