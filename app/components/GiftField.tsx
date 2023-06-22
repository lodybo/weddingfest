import RadioOption from '~/components/RadioOption';
import RadioLabel from '~/components/RadioLabel';
import { useState } from 'react';
import NumberInput from '~/components/NumberInput';

type Props = {
  value: number;
  onAmountChange: (amount: string) => void;
};

export default function GiftField({ value, onAmountChange }: Props) {
  const [showAmountField, setShowAmountField] = useState(true);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    onAmountChange(amount);
  };

  const handleAmountFieldVisibility = (visible: boolean) => {
    setShowAmountField(visible);

    if (!visible) {
      onAmountChange('0');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <p>
          Vaak nemen mensen op een bruiloft een envelopje mee, maar wij hebben
          liever een (optionele) bijdrage. Die kan je hieronder invullen, als je
          wil. Je kan ook een envelopje meenemen naar het feest, dat is ook
          prima!
        </p>

        <div className="flex w-full flex-row items-center gap-4">
          <RadioLabel label="Ik geef meteen een bijdrage">
            <RadioOption
              name="gift"
              defaultChecked
              onChange={() => handleAmountFieldVisibility(true)}
            />
          </RadioLabel>
          <RadioLabel label="Ik neem een envelopje mee">
            <RadioOption
              name="gift"
              onChange={() => handleAmountFieldVisibility(false)}
            />
          </RadioLabel>
        </div>
      </div>

      {showAmountField ? (
        <div className="flex w-full flex-row gap-4">
          <p className="w-full">Dat stellen we zeer op prijs, dank je!</p>
          <NumberInput onChange={handleAmountChange} defaultValue={value} />
        </div>
      ) : null}
    </div>
  );
}
