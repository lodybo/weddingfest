import PageLayout from '~/layouts/Page';

export default function PaymentSucceededRoute() {
  return (
    <PageLayout>
      <div className="flex flex-1 flex-col place-content-center place-items-center gap-4">
        <h1 className="font-handwriting text-7xl">Betaling gelukt!</h1>

        <p className="text-2xl">
          Bedankt voor je betaling! Je ontvangt een bevestiging per e-mail.
        </p>
      </div>
    </PageLayout>
  );
}
