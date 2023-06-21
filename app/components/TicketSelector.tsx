import type { PriceOption } from '~/models/payment.server';
import { useState } from 'react';
import { Select, SelectItem } from '~/components/Select';
import { formatAmountInLocale } from '~/utils/utils';
import GiftField from '~/components/GiftField';

type Props = {
  option: PriceOption;
  onQuantityChange: (option: PriceOption, quantity: string) => void;
};

export default function TicketSelector({ option, onQuantityChange }: Props) {
  const [numberOfTickets, setNumberOfTickets] = useState('0');

  const handleNumberOfTicketsChange = (option: PriceOption, value: string) => {
    setNumberOfTickets(value);
    onQuantityChange(option, value);
  };

  const handleGiftChange = (amount: string) => {
    option.amount = parseFloat(amount);
    onQuantityChange(option, '1');
  };

  return (
    <div
      className={`flex w-full flex-col items-center gap-4 border-cyan-200 px-4 transition-all ${
        numberOfTickets !== '0' ? 'border-2 py-4' : 'border-0 py-2'
      }`}
    >
      <div className="flex w-full flex-row gap-4">
        {option.type !== 'gift' ? (
          <>
            <div className="flex w-3/4 flex-col">
              <h2 className="w-full text-lg">
                {option.description}
                <span className="text-sm italic text-gray-400">
                  {' '}
                  - {formatAmountInLocale(option.amount)}
                </span>
              </h2>
              <p className="text-sm italic text-gray-400">
                {numberOfTickets !== '0' && numberOfTickets !== '10+' ? (
                  <span>
                    {formatAmountInLocale(option.amount)} x {numberOfTickets} ={' '}
                    {formatAmountInLocale(
                      option.amount * parseInt(numberOfTickets)
                    )}
                  </span>
                ) : null}
              </p>
            </div>

            <div className="w-1/4">
              <Select
                name="numberOfTickets"
                value={numberOfTickets.toString()}
                onValueChange={(value) =>
                  handleNumberOfTicketsChange(option, value)
                }
              >
                {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                ))}
                <SelectItem value="10+">10+</SelectItem>
              </Select>
            </div>
          </>
        ) : (
          <GiftField onAmountChange={handleGiftChange} />
        )}
      </div>
      {numberOfTickets === '10+' ? (
        <p className="text-sm italic text-gray-400">
          Wowza! Hartstikke leuk dat je met zo'n grote groep komt, maar wij
          weten niet zo snel of we dat aankunnen. Stuur even een appje naar ons
          om te kijken of we dit kunnen regelen.
        </p>
      ) : null}
    </div>
  );
}
