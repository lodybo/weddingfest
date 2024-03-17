import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import imageNames from '~/images.json';
import { GalleryItem } from '~/components/GalleryItem';
import Footer from '~/components/Footer';
import Anchor from '~/components/Anchor';

export async function loader() {
  return json({
    imageNames,
  });
}

// TODO: add password protection to this page.
// Intercepted routes: https://github.com/remix-run/remix/discussions/8731#discussioncomment-8436767
export default function GalleryPage() {
  const { imageNames } = useLoaderData();

  return (
    <>
      <div className="mx-auto w-[91vw] space-y-4">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="flex w-auto flex-none items-center justify-center">
            <Anchor to="/nagenieten">Nog even nagenieten?</Anchor>
          </div>
          <h1 className="w-full text-center font-handwriting text-hero">
            Galerij
          </h1>
        </div>
        <ul className="group/grid flex flex-wrap justify-center">
          {imageNames.map((imageName: string) => (
            <GalleryItem key={imageName} imageName={imageName} />
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}
