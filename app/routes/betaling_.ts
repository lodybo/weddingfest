import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { retrievePaymentIntent } from '~/stripe.server';
import * as Sentry from '@sentry/remix';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get('payment_intent');

  if (!paymentIntentId) {
    return redirect('/betalen');
  }

  try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);

    switch (paymentIntent.status) {
      case 'succeeded':
        const reqUrl = new URL(request.url);
        const successUrl = new URL('/betaling/gelukt', reqUrl.origin);
        successUrl.searchParams.set('rsvpId', paymentIntent.metadata.rsvpId);
        return redirect(successUrl.href);
      case 'canceled':
        return redirect('/betaling/geannuleerd');
      case 'requires_payment_method':
        return redirect('/betaling/mislukt');
      default:
        return redirect('/betaling/mislukt');
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}
