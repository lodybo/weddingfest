import Label from '~/components/Label';
import ErrorMessage from '~/components/ErrorMessage';
import { useState } from 'react';
import Icon from '~/components/Icon';
import PasswordInput from '~/components/PasswordInput';

type Props = {
  name?: string;
  label: string;
  value?: string;
  error?: string;
  autoComplete?: string;
};

export default function PasswordField({
  label,
  name = 'password',
  value,
  error,
  autoComplete,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <Label label={label}>
        <div className="flex flex-row justify-end gap-2">
          <PasswordInput
            className="w-full"
            showPassword={showPassword}
            name={name}
            defaultValue={value}
            autoComplete={autoComplete}
          />
          <button
            type="button"
            onClick={() => setShowPassword((showPassword) => !showPassword)}
          >
            <Icon name={showPassword ? 'eye-slash' : 'eye'} />
          </button>
        </div>
      </Label>
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
