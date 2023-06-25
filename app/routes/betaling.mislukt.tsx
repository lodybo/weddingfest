import Anchor from '~/components/Anchor';
import CenteredContentLayout from '~/layouts/CenteredContent';

export default function PaymentSucceededRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Helaas..</h1>

      <p className="text-2xl">
        Er is iets fout gegaan met de betaling. Je kan{' '}
        <Anchor to="/betalen">het opnieuw proberen</Anchor> of{' '}
        <Anchor to="/">terug naar de homepage</Anchor>.<br />
      </p>

      <p>Wij zijn geïnformeerd, maar je mag ons ook altijd even appen.</p>
    </CenteredContentLayout>
  );
}
