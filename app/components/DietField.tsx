import Label from '~/components/Label';
import { TextArea } from '~/components/TextArea';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  value?: string;
  error?: string;
};

export default function DietField({ value, error }: Props) {
  return (
    <div className="w-full">
      <Label label="Wat zijn je dieetwensen?">
        <TextArea name="diet" value={value} />
      </Label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
