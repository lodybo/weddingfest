import CenteredContentLayout from '~/layouts/CenteredContent';

export default function PaymentSucceededRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Betaling gelukt!</h1>

      <p className="text-2xl">
        Bedankt voor je betaling, we zien je op 19 augustus!
      </p>
    </CenteredContentLayout>
  );
}
