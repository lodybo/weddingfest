import TextInput from '~/components/TextInput';
import Label from '~/components/Label';

export default function NameField() {
  return (
    <Label label="Naam/Namen">
      <TextInput name="name" />
    </Label>
  );
}
