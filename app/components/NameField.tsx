import TextInput from '~/components/TextInput';
import Label from '~/components/Label';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  label: string;
  value?: string;
  error?: string;
};

export default function NameField({ value, error, label }: Props) {
  return (
    <div className="w-full">
      <Label label={label}>
        <TextInput name="name" defaultValue={value} />
      </Label>
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
