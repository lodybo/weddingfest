import type { SelectedPriceOption } from '~/models/payment.server';
import {
  calculateAndFormatPrice,
  formatAmountInLocale,
  calculatAndFormatTotalPrice,
} from '~/utils/utils';

type Props = {
  selectedTickets: SelectedPriceOption[];
};

export default function TicketsSummary({ selectedTickets }: Props) {
  const totalPrice = calculatAndFormatTotalPrice(selectedTickets);

  return (
    <div
      className={`w-full px-6 py-4 transition-all ${
        selectedTickets.length
          ? 'border-2 border-cyan-200 bg-cyan-50'
          : 'border border-gray-200 bg-transparent'
      }`}
    >
      <h2 className="mb-6 font-handwriting text-5xl">Bestelde tickets</h2>

      {!selectedTickets.length ? (
        <p>Kies hiernaast de tickets voor jezelf/jullie gezelschap.</p>
      ) : null}

      <ul className="space-y-4">
        {selectedTickets.map((ticket) => (
          <li className="flex flex-col" key={ticket.option.slug}>
            <div className="flex flex-row justify-between">
              <p className="text-xl">
                {ticket.quantity}x {ticket.option.description}
              </p>
            </div>
            <p className="text-sm italic text-gray-400">
              {ticket.quantity !== '0' && ticket.quantity !== '10+' ? (
                <p>
                  {ticket.quantity} x{' '}
                  {formatAmountInLocale(ticket.option.amount)} ={' '}
                  {calculateAndFormatPrice(
                    ticket.option.amount,
                    ticket.quantity
                  )}
                </p>
              ) : null}
            </p>
          </li>
        ))}
      </ul>

      {selectedTickets.length ? (
        <div className="mt-6 flex flex-row justify-between">
          <p className="text-2xl">Totaal:</p>
          <p className="text-2xl">{totalPrice}</p>
        </div>
      ) : null}
    </div>
  );
}
