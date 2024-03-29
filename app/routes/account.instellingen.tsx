import SettingsForm from '~/components/SettingsForm';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/session.server';
import { useActionData, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import sanitizeHtml from 'sanitize-html';
import { changeUserEmail, changeUserPassword } from '~/models/user.server';
import { validateChangePasswordForm } from '~/validations/auth';

export type ActionData = {
  errors?: {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    verifiedPassword?: string;
    passwordMismatch?: string;
  };
  success?: {
    email?: string;
    currentPassword?: string;
  };
};

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  return json({ user });
}

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  const successes: ActionData['success'] = {};

  const formDataEmail = formData.get('email');
  const formDataCurrentPassword = formData.get('current-password');
  const formDataNewPassword = formData.get('new-password');
  const formDataVerifiedPassword = formData.get('verify-password');

  invariant(formDataEmail, 'Email is required');
  invariant(typeof formDataEmail === 'string', 'Email must be a string');
  invariant(
    typeof formDataCurrentPassword === 'string',
    'Current password must be a string'
  );
  invariant(
    typeof formDataNewPassword === 'string',
    'New password must be a string'
  );
  invariant(
    typeof formDataVerifiedPassword === 'string',
    'Verified password must be a string'
  );

  const email = sanitizeHtml(formDataEmail);
  const currentPassword = sanitizeHtml(formDataCurrentPassword);
  const newPassword = sanitizeHtml(formDataNewPassword);
  const verifiedPassword = sanitizeHtml(formDataVerifiedPassword);

  if (email && email !== user.email) {
    await changeUserEmail(user.id, email);
    successes.email = 'E-mailadres is gewijzigd';
  }

  if (currentPassword) {
    const errors = validateChangePasswordForm({
      currentPassword,
      newPassword,
      verifyPassword: verifiedPassword,
    });

    console.log(errors);
    if (errors) {
      return json<ActionData>(
        {
          errors,
        },
        { status: 400 }
      );
    }

    invariant(
      newPassword === verifiedPassword,
      'New password and verified password must match'
    );
    invariant(
      currentPassword !== newPassword,
      'New password and current password must not match'
    );

    await changeUserPassword(user.email, newPassword);
    successes.currentPassword = 'Wachtwoord is gewijzigd';
  }

  return json<ActionData>({ success: successes });
}

export default function AccountSettingsRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="space-y-12">
      <h1 className="font-handwriting text-6xl">Instellingen</h1>

      <SettingsForm email={user.email} actionData={actionData} />
    </div>
  );
}
