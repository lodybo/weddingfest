import Anchor from '~/components/Anchor';
import CenteredContentLayout from '~/layouts/CenteredContent';

export default function PaymentSucceededRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Betaling geannuleerd</h1>

      <p className="text-2xl">
        De betaling is geannuleerd. Je kan{' '}
        <Anchor to="/betalen">het opnieuw proberen</Anchor> of{' '}
        <Anchor to="/">terug naar de homepage</Anchor>.
      </p>
    </CenteredContentLayout>
  );
}
