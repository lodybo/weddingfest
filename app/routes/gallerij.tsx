import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import imageNames from '~/images.json';
import { GalleryItem } from '~/components/GalleryItem';

export async function loader() {
  return json({
    imageNames,
  });
}

// TODO: add password protection to this page.
// Intercepted routes: https://github.com/remix-run/remix/discussions/8731#discussioncomment-8436767
export default function GalleryPage() {
  const { imageNames } = useLoaderData();

  // TODO: use modal? post on stackoverflow? revert scroll position key?
  return (
    <div className="mx-auto w-[72vw] space-y-4">
      <h1 className="font-handwriting text-hero">Galerij</h1>
      <ul className="group/grid flex flex-wrap">
        {imageNames.map((imageName: string) => (
          <GalleryItem key={imageName} imageName={imageName} />
        ))}
      </ul>
    </div>
  );
}
