import { useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useMatchesData } from '~/utils/utils';
import type { StripePaymentElementOptions } from '@stripe/stripe-js';
import Button from '~/components/Button';
import ErrorMessage from '~/components/ErrorMessage';
import { Form } from '@remix-run/react';
import Loader from '~/components/Loader';

type Props = {
  returnUrl: string;
};

export default function CheckoutForm({ returnUrl }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const data = useMatchesData('routes/betalen');
  const { clientSecret } = data as any;

  if (!stripe || !clientSecret) {
    return;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message ?? 'Er is iets misgegaan. Probeer het opnieuw.');
    } else {
      setMessage('Er is iets misgegaan. Probeer het opnieuw.');
    }

    setIsSubmitting(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'accordion',
  };

  const buttonIsDisabled = isSubmitting || !stripe || !elements;

  return (
    <Form className="w-full space-y-6" onSubmit={handleSubmit}>
      {isLoading ? (
        <p>
          <Loader /> Een momentje, dan laden we het betaalformulier in...
        </p>
      ) : null}
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        onLoaderStart={() => setIsLoading(true)}
        onReady={() => setIsLoading(false)}
      />
      {!isLoading ? (
        <Button variant="primary" type="submit" disabled={buttonIsDisabled}>
          Betalen
        </Button>
      ) : null}
      {message ? <ErrorMessage message={message} /> : null}
    </Form>
  );
}
