import { Form, useSearchParams } from '@remix-run/react';
import Button from '~/components/Button';
import EmailField from '~/components/EmailField';
import PasswordField from '~/components/PasswordField';
import type { AuthErrors } from '~/validations/auth';
import * as React from 'react';
import Anchor from '~/components/Anchor';

type Props = {
  errors?: AuthErrors;
};

export function LoginForm({ errors }: Props) {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';

  return (
    <Form
      action="/inloggen"
      method="post"
      className="w-full max-w-md space-y-6 px-8"
      noValidate
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <EmailField label="Wat is je e-mailadres?" error={errors?.email} />

      <PasswordField label="En je wachtwoord?" error={errors?.password} />

      <Button className="w-full" variant="primary" type="submit">
        Inloggen
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Onthoud mij
          </label>
        </div>
        <div className="text-center text-sm text-gray-500">
          Wachtwoord vergeten?{' '}
          <Anchor
            to={{
              pathname: '/wachtwoord-resetten',
            }}
          >
            Klik hier
          </Anchor>
        </div>
      </div>
    </Form>
  );
}
