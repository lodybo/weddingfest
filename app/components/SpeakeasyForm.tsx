import { type AuthErrors } from '~/validations/auth';
import PasswordField from '~/components/PasswordField';
import Button from '~/components/Button';
import { Form, useSearchParams } from '@remix-run/react';
import Title from '~/components/Title';
import Subtitle from '~/components/Subtitle';

type Props = {
  errors?: AuthErrors;
};

export default function SpeakeasyForm({ errors }: Props) {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';

  return (
    <div className="mx-auto flex h-screen w-full flex-col items-center justify-center px-3 md:w-2/3">
      <Title>Niet zo snel!</Title>
      <Subtitle>
        Omdat er op de afbeeldingen en foto's veel mensen staan, moeten we zeker
        weten of je ze überhaupt mag zien. Vul daarom het toegangswoord in.
      </Subtitle>
      <Form
        action="/inloggen"
        method="post"
        className="w-full max-w-md space-y-6 px-8"
        noValidate
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <PasswordField
          label="Wat is het toegangswoord?"
          error={errors?.password}
        />

        <Button className="w-full" variant="primary" type="submit">
          Geef mij toegang!
        </Button>
      </Form>
    </div>
  );
}
