import PageLayout from '~/layouts/Page';
import SmallWeddingTimer from '~/components/SmallWeddingTimer';

export default function Index() {
  return (
    <PageLayout>
      <div className="mb-10 w-full px-8 sm:w-3/4">
        <h1 className="mb-grow-x text-center font-handwriting text-hero">
          Wij gaan trouwen!
        </h1>

        <p className="mb-10 text-center text-resp">
          Wij geven elkaar op <strong>27 augustus</strong> het ja-woord.
        </p>

        <SmallWeddingTimer />
      </div>
    </PageLayout>
  );
}
