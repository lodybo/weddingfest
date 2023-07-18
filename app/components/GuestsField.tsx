import RadioOption from '~/components/RadioOption';
import { useState } from 'react';
import RadioLabel from '~/components/RadioLabel';

type Props = {
  value: string;
};

export default function GuestsField({ value = '1' }: Props) {
  const [multipleGuests, setMultipleGuests] = useState(value > '1');
  const [guests, setGuests] = useState(value);
  const [guestFieldValue, setGuestFieldValue] = useState('2');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const isMultipleGuests = value === '1';
    setMultipleGuests(isMultipleGuests);
    if (isMultipleGuests) {
      setGuests(guestFieldValue);
    } else {
      setGuests('1');
    }
  };

  const handleGuestsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setGuests(value);
    setGuestFieldValue(value);
  };

  return (
    <div className="w-full">
      <input type="hidden" name="guests" value={guests} />

      <RadioLabel label="Ik kom alleen">
        <RadioOption
          name="multiple-guests"
          value="0"
          defaultChecked={!multipleGuests}
          onChange={handleChange}
        />
      </RadioLabel>
      <RadioLabel label="Ik kom met meerdere mensen">
        <RadioOption
          name="multiple-guests"
          value="1"
          defaultChecked={multipleGuests}
          onChange={handleChange}
        />
      </RadioLabel>

      {multipleGuests ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-row items-center justify-start gap-2">
            <span className="text-grey-500">Ik kom met</span>
            <input
              className="inline-block w-14 text-cyan-700 outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
              type="number"
              name="guests"
              min="2"
              value={guests}
              onChange={handleGuestsChange}
            />
            <span className="text-grey-500">gasten</span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
