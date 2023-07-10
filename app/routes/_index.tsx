import type { ReactNode } from 'react';
import PageLayout from '~/layouts/Page';
import SmallWeddingTimer from '~/components/SmallWeddingTimer';
import Button from '~/components/Button';
import { ClientOnly } from 'remix-utils';

export default function Index() {
  return (
    <PageLayout>
      <div className="w-full space-y-10 px-8 sm:w-3/4 xl:space-y-20">
        <Title>Wij gaan trouwen!</Title>

        <Subtitle>
          Wij geven elkaar op <strong>19 augustus</strong>{' '}
          <small className="align-middle text-xs xl:text-lg">
            (nog een keertje)
          </small>{' '}
          het ja-woord.
        </Subtitle>

        <ClientOnly>{() => <SmallWeddingTimer />}</ClientOnly>

        <Paragraph>
          We hebben grootse plannen voor die dag, maar die houden we nog even
          geheim. <br />
          In de tussentijd willen we je vragen om je RSVP in te vullen.
        </Paragraph>

        <Button
          className="mx-auto w-3/4 xl:w-1/2"
          variant="primary"
          size="large"
          to="/ik-kom"
        >
          Ik wil mijn aan-/afwezigheid opgeven
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
  <p className="text-center text-xl xl:text-4xl">{children}</p>
);
