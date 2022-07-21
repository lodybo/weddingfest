import Navigation from '~/components/Navigation';
import Label from '~/components/Label';
import TextInput from '~/components/inputs/Text';
import ListInput from '~/components/inputs/List';
import ToggleInput from '~/components/inputs/Toggle';
import type { ToggleOption } from '~/components/inputs/Toggle';

import weddingCouple from '~/images/wedding-couple.jpg';

export default function AttendancePage() {
  const attendanceOptions: ToggleOption[] = [
    { label: 'Ja', value: 'true', color: 'green' },
    { label: 'Nee', value: 'false' },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation />

      <img
        className="mb-10 h-[50vh] w-full object-cover object-center"
        src={weddingCouple}
        alt="wedding couple"
      />

      <p className="prose md:prose-lg">
        Wij gaan trouwen en willen graag weten of je erbij bent! <br />
        We vragen je daarom onderstaand formulier in te vullen voor ons.
      </p>

      <form className="mt-10 flex w-1/4 flex-1 flex-col items-center justify-center">
        <Label label="Naam/Namen">
          <TextInput name="name" />
        </Label>

        <p className="mb-2 text-center">Aanwezig</p>
        <ToggleInput name="attendance" options={attendanceOptions} />

        <p className="mb-2 text-center">Ik/wij nemen mee voor de potluck</p>
        <ListInput />

        <button>Verzenden</button>
      </form>
    </div>
  );
}
