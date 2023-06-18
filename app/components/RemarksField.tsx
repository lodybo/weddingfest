import Label from '~/components/Label';
import { TextArea } from '~/components/TextArea';
import ErrorMessage from '~/components/ErrorMessage';

type Props = {
  value?: string | null;
  error?: string;
};

export default function RemarksField({ value, error }: Props) {
  return (
    <div className="w-full">
      <Label label="Heb je verder nog opmerkingen of dingen te melden?">
        <TextArea name="remarks" defaultValue={value || ''} />
      </Label>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
