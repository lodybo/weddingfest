import type Stripe from 'stripe';
import type { ActionArgs } from '@remix-run/node';
import { serverError } from 'remix-utils';
import { json } from '@remix-run/node';
import * as Sentry from '@sentry/remix';
import { stripe } from '~/stripe.server';
import { getErrorMessage } from '~/utils/utils';
import { markPaymentAsComplete } from '~/models/payment.server';

export async function action({ request }: ActionArgs) {
  const signature = request.headers.get('stripe-signature') ?? '';
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    Sentry.captureException(err);
    const message = getErrorMessage(err);
    console.error('Stripe error', message);
    return serverError({ message });
  }

  let paymentIntent: Stripe.PaymentIntent;
  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `Payment ${paymentIntent.id} succeeded for rsvp ${paymentIntent.metadata.rsvpId}`
      );
      try {
        await markPaymentAsComplete(
          paymentIntent.metadata.rsvpId,
          paymentIntent.id
        );
      } catch (err) {
        Sentry.captureException(err);
      }
      break;

    case 'payment_intent.payment_failed':
      paymentIntent = event.data.object as Stripe.PaymentIntent;
      Sentry.captureException(
        `Payment failed: ${paymentIntent.last_payment_error?.message}`,
        {
          extra: { ...paymentIntent.last_payment_error } || undefined,
        }
      );

      throw new Error(
        `Payment failed: ${paymentIntent.last_payment_error?.message}`
      );

    default:
      Sentry.captureException(`Unhandled event type: ${event.type}`, {
        level: 'warning',
      });
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return json({});
}
