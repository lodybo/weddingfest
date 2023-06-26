import { Form } from '@remix-run/react';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import Button from '~/components/Button';
import type { ActionData } from '~/routes/account.instellingen';
import ErrorMessage from '~/components/ErrorMessage';
import SuccessMessage from '~/components/SuccessMessage';

type Props = {
  email: string;
  actionData?: ActionData;
};

export default function SettingsForm({ email, actionData }: Props) {
  return (
    <Form method="post" className="w-2/3 space-y-4">
      {actionData?.success?.email ? (
        <SuccessMessage message={actionData.success.email} />
      ) : null}

      {actionData?.success?.currentPassword ? (
        <SuccessMessage message={actionData.success.currentPassword} />
      ) : null}

      {actionData?.errors?.passwordMismatch ? (
        <ErrorMessage message={actionData.errors.passwordMismatch} />
      ) : null}

      <EmailField
        label="E-mailadres"
        value={email}
        error={actionData?.errors?.email}
      />

      <PasswordField
        name="current-password"
        autoComplete="current-password"
        label="Huidig wachtwoord"
        error={actionData?.errors?.currentPassword}
      />

      <PasswordField
        name="new-password"
        autoComplete="new-password"
        label="Nieuw wachtwoord"
        error={actionData?.errors?.newPassword}
      />

      <PasswordField
        name="verify-password"
        autoComplete="verify-password"
        label="Herhaal nieuw wachtwoord"
        error={actionData?.errors?.verifiedPassword}
      />

      <div className="flex flex-row justify-end">
        <Button type="submit" variant="primary">
          Opslaan
        </Button>
      </div>
    </Form>
  );
}
