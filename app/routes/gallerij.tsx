import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import imageNames from '~/images.json';
import { Image } from '~/components/Image';

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
    <div className="mx-auto w-[72vw] space-y-4">
      <h1 className="font-handwriting text-hero">Galerij</h1>
      <ul className="group/grid flex flex-wrap">
        {imageNames.map((imageName: string) => (
          <li
            className="group/image m-2 h-[200px] w-[200px] cursor-pointer overflow-hidden transition-opacity duration-300 hover:!opacity-100 group-hover/grid:opacity-80"
            key={imageName}
          >
            <Link to={`/foto/${imageName}`}>
              <Image
                className="scale-100 transition-transform duration-300 group-hover/image:scale-105"
                src={`/image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${imageName}`}
                srcSet={`
                /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${imageName}?w=200&h=200&fit=cover  400w,
              `}
                sizes={`
                400px
              `}
                alt={imageName}
                loading="lazy"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
