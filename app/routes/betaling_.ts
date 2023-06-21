import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { retrievePaymentIntent } from '~/stripe.server';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get('payment_intent');

  if (!paymentIntentId) {
    return redirect('/betalen');
  }

  const paymentIntent = await retrievePaymentIntent(paymentIntentId);

  switch (paymentIntent.status) {
    case 'succeeded':
      return redirect('/betaling/gelukt');
    case 'canceled':
      return redirect('/betaling/geannuleerd');
    case 'requires_payment_method':
      return redirect('/betaling/mislukt');
    default:
      return redirect('/betaling/mislukt');
  }
}
