import TextInput from '~/components/TextInput';
import Label from '~/components/Label';
import ErrorMessage from '~/components/ErrorMessage';

type Props = Pick<JSX.IntrinsicElements['input'], 'value'> & {
  error?: string;
};

export default function NameField({ value, error }: Props) {
  return (
    <div className="w-full">
      <Label label="Wat is je naam/jullie namen?">
        <TextInput name="name" defaultValue={value} />
      </Label>
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
