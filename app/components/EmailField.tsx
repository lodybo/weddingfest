import Label from '~/components/Label';
import ErrorMessage from '~/components/ErrorMessage';
import EmailInput from '~/components/EmailInput';

type Props = {
  label: string;
  value?: string;
  error?: string;
};

export default function EmailField({ label, value, error }: Props) {
  return (
    <div className="w-full">
      <Label label={label}>
        <EmailInput name="email" defaultValue={value} />
      </Label>
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
