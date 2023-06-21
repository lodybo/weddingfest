import PageLayout from '~/layouts/Page';
import Anchor from '~/components/Anchor';

export default function PaymentSucceededRoute() {
  return (
    <PageLayout>
      <div className="flex flex-1 flex-col place-content-center place-items-center gap-4">
        <h1 className="font-handwriting text-7xl">Helaas..</h1>

        <p className="text-2xl">
          Er is iets fout gegaan met de betaling. Je kan{' '}
          <Anchor to="/betalen">het opnieuw proberen</Anchor> of{' '}
          <Anchor to="/">terug naar de homepage</Anchor>.<br />
        </p>

        <p>Wij zijn geïnformeerd, maar je mag ons ook altijd even appen.</p>
      </div>
    </PageLayout>
  );
}
