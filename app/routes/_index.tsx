import type { ReactNode } from 'react';
import PageLayout from '~/layouts/Page';
import SmallWeddingTimer from '~/components/SmallWeddingTimer';
import Button from '~/components/Button';

export default function Index() {
  return (
    <PageLayout>
      <div className="w-full space-y-20 px-8 sm:w-3/4">
        <Title>Wij gaan trouwen!</Title>

        <Subtitle>
          Wij geven elkaar op <strong>19 augustus</strong>{' '}
          <small className="align-middle text-lg">(nog een keertje)</small> het
          ja-woord.
        </Subtitle>

        <SmallWeddingTimer />

        <Paragraph>
          We hebben grootse plannen voor die dag, maar die houden we nog even
          geheim. <br />
          In de tussentijd willen we je vragen om je RSVP in te vullen.
        </Paragraph>

        <Button
          className="mx-auto w-1/2"
          variant="primary"
          size="large"
          to="/ik-kom"
        >
          Ik kom!
        </Button>
      </div>
    </PageLayout>
  );
}

const Title = ({ children }: { children: ReactNode }) => (
  <h1 className="mb-grow-x text-center font-handwriting text-hero">
    {children}
  </h1>
);

const Subtitle = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-resp">{children}</p>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-4xl">{children}</p>
);