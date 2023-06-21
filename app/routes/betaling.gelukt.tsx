import CenteredContentLayout from '~/layouts/CenteredContent';

export default function PaymentSucceededRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Betaling gelukt!</h1>

      <p className="text-2xl">
        Bedankt voor je betaling! Je ontvangt een bevestiging per e-mail.
      </p>
    </CenteredContentLayout>
  );
}
