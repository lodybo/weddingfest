import TextInput from '~/components/TextInput';
import Label from '~/components/Label';
import ErrorMessage from '~/components/ErrorMessage';
import { forwardRef } from 'react';

type Props = {
  label: string;
  recipients?: string[];
  error?: string;
  chooseAddressesCallback?: () => void;
};

const EmailAddressesField = forwardRef<HTMLInputElement, Props>(
  ({ recipients, error, label }, ref) => {
    return (
      <div className="w-full">
        <Label label={label}>
          <TextInput
            ref={ref}
            name="from"
            defaultValue={recipients?.join(', ')}
          />
        </Label>
        {error ? <ErrorMessage message={error} /> : null}
      </div>
    );
  }
);
EmailAddressesField.displayName = 'EmailAddressesField';

export default EmailAddressesField;
