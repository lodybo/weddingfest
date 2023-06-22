import type { PriceOption, SelectedPriceOption } from '~/models/payment.server';
import TicketSelector from '~/components/TicketSelector';
import { useState } from 'react';

type Props = {
  options: PriceOption[];
  onSelectionChange: (selection: SelectedPriceOption[]) => void;
  selectedTickets: SelectedPriceOption[];
};

export default function TicketForm({
  options,
  onSelectionChange,
  selectedTickets,
}: Props) {
  const [tickets, setTickets] =
    useState<SelectedPriceOption[]>(selectedTickets);

  const handleQuantityChange = (option: PriceOption, quantity: string) => {
    const newTickets = tickets.filter((t) => t.option.slug !== option.slug);

    if (option.type === 'gift') {
      if (option.amount) {
        newTickets.push({ option, quantity });
      }
    } else {
      if (quantity !== '0') {
        newTickets.push({ option, quantity });
      }
    }

    setTickets(newTickets);
    onSelectionChange(newTickets);
  };

  return (
    <div className="w-full px-0 py-2 md:px-6 md:py-4">
      <h2 className="mb-4 font-handwriting text-5xl">Tickets</h2>
      <ul className="space-y-6">
        {options.map((option) => (
          <li key={option.slug}>
            <TicketSelector
              option={option}
              onQuantityChange={handleQuantityChange}
              ticket={selectedTickets.find(
                (t) => t.option.slug === option.slug
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
