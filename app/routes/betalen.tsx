import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly, serverError } from 'remix-utils';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import invariant from 'tiny-invariant';
import * as Sentry from '@sentry/remix';
import { getRsvpIDFromSession } from '~/session.server';
import type { SelectedPriceOption } from '~/models/payment.server';
import {
  convertPriceOptionsToSelectedTickets,
  coupleStripeToPayment,
  getPaymentForRsvp,
  getTotalPriceForRsvp,
} from '~/models/payment.server';
import { getDomainUrl, getErrorMessage } from '~/utils/utils';
import CheckoutForm from '~/components/CheckoutForm';
import { stripe } from '~/stripe.server';
import PaymentSummary from '~/components/PaymentSummary';

export interface StripeLoaderData {
  clientSecret: string;
  tickets: SelectedPriceOption[];
  returnUrl: string;
}

interface ErrorLoaderData {
  message: string;
}

type LoaderData = StripeLoaderData | ErrorLoaderData;

export async function loader({ request }: LoaderArgs) {
  const rsvpId = await getRsvpIDFromSession(request);
  const payment = await getPaymentForRsvp(rsvpId);
  invariant(payment && payment.tickets, 'No payment found for RSVP');

  const totalPrice = await getTotalPriceForRsvp(rsvpId);

  if (totalPrice === 0) {
    return redirect('/betaling/niet-nodig');
  }

  const selectedTickets = convertPriceOptionsToSelectedTickets(payment.tickets);

  const returnUrl = getDomainUrl(request) + '/betaling';

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        rsvpId,
      },
    });
    invariant(
      paymentIntent.client_secret,
      'Payment intent has no client secret'
    );

    await coupleStripeToPayment(rsvpId, paymentIntent.id);

    return json<LoaderData>({
      clientSecret: paymentIntent.client_secret,
      tickets: selectedTickets,
      returnUrl,
    });
  } catch (error) {
    Sentry.captureException(error);
    const message = getErrorMessage(error);

    return serverError<LoaderData>({ message });
  }
}

export default function PayRoute() {
  const { clientSecret, tickets, returnUrl } =
    useLoaderData<StripeLoaderData>();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
    loader: 'always',
  };

  return (
    <>
      <div className="w-full max-w-screen-lg space-y-6 px-8">
        <h1 className="font-handwriting text-7xl">Betalen</h1>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full flex-1">
            {clientSecret ? (
              <>
                <ClientOnly>
                  {() => (
                    <>
                      <Elements
                        stripe={loadStripe(window.ENV.STRIPE_PUBLISHABLE_KEY)}
                        options={options}
                      >
                        <>
                          <CheckoutForm returnUrl={returnUrl} />
                        </>
                      </Elements>
                    </>
                  )}
                </ClientOnly>
              </>
            ) : null}
          </div>
          <div className="w-full flex-1">
            <PaymentSummary selectedTickets={tickets} />
          </div>
        </div>
      </div>
    </>
  );
}
