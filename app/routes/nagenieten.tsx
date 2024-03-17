import { type ReactNode } from 'react';
import Anchor from '~/components/Anchor';
import Aftermovie from '~/components/Aftermovie';
import { json } from '@remix-run/node';
import imageNames from '~/images-selection.json';
import { useLoaderData } from '@remix-run/react';
import GalleryPreview from '~/components/GalleryPreview';
import Button from '~/components/Button';

export async function loader() {
  return json({
    imageNames,
  });
}

export default function AfterPartyPage() {
  const { imageNames } = useLoaderData<typeof loader>();

  // TODO: first dance video
  // TODO: add password protection to this page.
  return (
    <div className="mx-auto mt-0 w-full space-y-4 px-5 lg:w-2/3">
      <h1 className="text-center font-handwriting text-hero">
        Bedankt dat je er bij was!
      </h1>

      <Paragraph>
        We hopen dat je net zo hebt genoten als wij. Het was een fantastische
        dag en we zijn blij dat we het met jullie hebben kunnen delen.
      </Paragraph>

      <Paragraph>
        Wil je nog even nagenieten van de dag? Klik{' '}
        <Anchor to="/nagenieten">hier</Anchor> om de aftermovie te bekijken.
      </Paragraph>

      <Aftermovie />

      <Paragraph>
        Gelukkig hebben we de foto's nog! Klik{' '}
        <Anchor to="/gallerij">hier</Anchor> om ze te bekijken.
      </Paragraph>

      <GalleryPreview images={imageNames} />

      <Button to="/gallerij">Bekijk alle foto's</Button>
    </div>
  );
}

type ParagraphProps = {
  children: ReactNode;
};

function Paragraph({ children }: ParagraphProps) {
  return <p className="text-center text-2xl leading-tight">{children}</p>;
}
