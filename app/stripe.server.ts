import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function retrievePaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id);
}
