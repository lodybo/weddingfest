import { Form } from '@remix-run/react';
import Button from '~/components/Button';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import NameField from '~/components/NameField';
import type { AuthErrors } from '~/validations/auth';

type Props = {
  rsvp?: string;
  errors?: AuthErrors;
  success?: any;
  data?: any;
};

export function RegisterForm({ rsvp, errors, success, data }: Props) {
  return (
    <Form
      action="/aanmelden"
      method="post"
      className="w-full max-w-md space-y-6 px-8"
      noValidate
    >
      {rsvp && <input type="hidden" name="rsvp" value={rsvp} />}

      <NameField
        label="Wat is jouw naam?"
        error={errors?.name}
        value={data?.name}
      />

      <EmailField
        label="En je e-mailadres?"
        error={errors?.email}
        value={data?.email}
      />

      <PasswordField
        label="En als laatste, welk wachtwoord wil je gebruiken?"
        error={errors?.password}
        value={data?.password}
        autoComplete="new-password"
      />

      <PasswordField
        name="verifyPassword"
        label="Grapje, nog een keer: wélk wachtwoord wil je gebruiken?"
        error={errors?.verifyPassword}
        autoComplete="verify-password"
      />

      <Button type="submit" variant="primary">
        Account aanmaken
      </Button>

      {errors?.existingUser && <p>{errors.existingUser}</p>}

      {success?.user && <p>{success.user}</p>}
    </Form>
  );
}
