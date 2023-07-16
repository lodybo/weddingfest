import { Form } from '@remix-run/react';
import Button from '~/components/Button';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import type { AuthErrors } from '~/validations/auth';

type Props = {
  errors?: AuthErrors;
};

export function PasswordResetForm({ errors }: Props) {
  return (
    <Form
      action="/wachtwoord-resetten"
      method="post"
      className="w-full max-w-md space-y-6 px-8"
      noValidate
    >
      <EmailField label="En je e-mailadres?" error={errors?.email} />

      <PasswordField
        label="En als laatste, welk wachtwoord wil je gebruiken?"
        error={errors?.password}
        autoComplete="new-password"
      />

      <PasswordField
        label="Grapje, nog een keer: wélk wachtwoord wil je gebruiken?"
        error={errors?.verifyPassword}
        autoComplete="verify-password"
      />

      <Button type="submit" variant="primary">
        Verander wachtwoord
      </Button>
    </Form>
  );
}
