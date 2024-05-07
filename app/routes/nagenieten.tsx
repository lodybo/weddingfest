import { type ReactNode } from 'react';
import { json, redirect } from '@remix-run/node';
import { type LoaderFunctionArgs } from '@remix-run/router';
import imageNames from '~/images-selection.json';
import Anchor from '~/components/Anchor';
import Aftermovie from '~/components/Aftermovie';
import { useLoaderData } from '@remix-run/react';
import GalleryPreview from '~/components/GalleryPreview';
import FirstDanceMovie from '~/components/FirstDanceMovie';
import Footer from '~/components/Footer';
import { getSession } from '~/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (!session.get('hasAccess')) {
    return redirect('/inloggen?redirectTo=/nagenieten');
  }

  return json({
    imageNames,
  });
}

export default function AfterPartyPage() {
  const { imageNames } = useLoaderData<typeof loader>();

  // TODO: add password protection to this page.
  return (
    <div className="space-y-6">
      <div className="mx-auto mt-0 w-full space-y-4 px-5 lg:w-2/3">
        <h1 className="text-center font-handwriting text-hero">
          Bedankt dat je er bij was!
        </h1>

        <Paragraph>
          We hopen dat je net zo hebt genoten als wij. Het was een fantastische
          dag en we zijn blij dat we het met jullie hebben kunnen delen.
        </Paragraph>

        <Paragraph>
          Wil je nog even nagenieten van de dag? Bekijk dan de aftermovie.
        </Paragraph>

        <Aftermovie />

        <Paragraph>
          Of, wil je misschien de 1e dans nog een keer bekijken?
        </Paragraph>

        <FirstDanceMovie />

        <Paragraph>
          Of wil je liever wegzwijmelen bij de foto's! Bekijk de hele{' '}
          <Anchor to="/gallerij">galerij</Anchor>.
        </Paragraph>

        <GalleryPreview images={imageNames} />
      </div>
      <Footer />
    </div>
  );
}

type ParagraphProps = {
  children: ReactNode;
};

function Paragraph({ children }: ParagraphProps) {
  return (
    <p className="text-center text-xl leading-tight md:text-2xl">{children}</p>
  );
}
