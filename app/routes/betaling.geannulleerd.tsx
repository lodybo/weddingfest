import PageLayout from '~/layouts/Page';
import Anchor from '~/components/Anchor';

export default function PaymentSucceededRoute() {
  return (
    <PageLayout>
      <div className="flex flex-1 flex-col place-content-center place-items-center gap-4">
        <h1 className="font-handwriting text-7xl">Betaling geannulleerd</h1>

        <p className="text-2xl">
          De betaling is geannuleerd. Je kan{' '}
          <Anchor to="/betalen">het opnieuw proberen</Anchor> of{' '}
          <Anchor to="/">terug naar de homepage</Anchor>.
        </p>
      </div>
    </PageLayout>
  );
}
