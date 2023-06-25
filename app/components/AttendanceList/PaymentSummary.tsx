import type { SelectedPriceOption } from '~/models/payment.server';
import {
  calculateAndFormatPrice,
  formatAmountInLocale,
  calculateAndFormatTotalPrice,
} from '~/utils/utils';

type Props = {
  selectedTickets: SelectedPriceOption[];
};

export default function PaymentSummary({ selectedTickets }: Props) {
  const totalPrice = calculateAndFormatTotalPrice(selectedTickets);

  const hasItems = selectedTickets.length > 0;

  return (
    <div
      className={`w-full px-6 py-4 transition-all ${
        hasItems
          ? 'border-2 border-cyan-200 bg-cyan-50'
          : 'border border-gray-200 bg-transparent'
      }`}
    >
      <h2 className="mb-6 font-handwriting text-5xl">Bestelde tickets</h2>

      {!hasItems ? (
        <p>Kies hiernaast de tickets voor jezelf/jullie gezelschap.</p>
      ) : null}

      <ul className="space-y-4">
        {selectedTickets.map((ticket) => {
          if (ticket.option.type === 'gift') {
            return (
              <li className="flex flex-row" key={ticket.option.slug}>
                <div className="flex flex-row justify-between gap-2">
                  <p className="text-xl">{ticket.option.description}</p>
                </div>
                <p className="text-xl italic text-gray-400">
                  {formatAmountInLocale(ticket.option.amount)}
                </p>
              </li>
            );
          } else {
            return (
              <li
                className="flex flex-row justify-between gap-2"
                key={ticket.option.slug}
              >
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row justify-between">
                    <p className="text-xl">
                      {ticket.quantity}x {ticket.option.description}
                    </p>
                  </div>
                  <p className="text-sm italic text-gray-400">
                    {ticket.quantity !== '0' && ticket.quantity !== '10+' ? (
                      <span className="block">
                        {ticket.quantity} x{' '}
                        {formatAmountInLocale(ticket.option.amount)} ={' '}
                        {calculateAndFormatPrice(
                          ticket.option.amount,
                          ticket.quantity
                        )}
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="text-xl italic text-gray-400">
                  {calculateAndFormatPrice(
                    ticket.option.amount,
                    ticket.quantity
                  )}
                </p>
              </li>
            );
          }
        })}
      </ul>

      {hasItems ? (
        <div className="mt-6 flex flex-row justify-between">
          <p className="text-2xl">Totaal:</p>
          <p className="text-2xl">{totalPrice}</p>
        </div>
      ) : null}
    </div>
  );
}
