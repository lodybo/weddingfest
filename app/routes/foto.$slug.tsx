import { type LoaderFunctionArgs } from '@remix-run/router';
import invariant from 'tiny-invariant';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Image } from '~/components/Image';
import { useState } from 'react';
import ResizeButton from '~/components/ResizeButton';
import CopyrighText from '~/components/CopyrightText';

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, 'slug is required');

  return json({ slug });
}

// TODO: add password protection to this page.
// Intercepted routes: https://github.com/remix-run/remix/discussions/8731#discussioncomment-8436767
export default function PhotoPage() {
  const { slug } = useLoaderData<typeof loader>();

  const [fullScreen, setFullScreen] = useState(true);

  return (
    <div className="relative">
      <Image
        className={`h-screen w-screen ${
          fullScreen
            ? 'object-cover object-center md:object-center'
            : 'object-contain'
        }`}
        src={`/image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=200&h=200&fit=cover`}
        srcSet={`
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=400  400w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=800  800w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=1200 1200w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=1600 1600w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=2000 2000w,
        `}
        sizes={`
          400px
          800px
          1200px
          1600px
          2000px
        `}
        alt={slug}
      />
      <div className="absolute bottom-0 flex h-10 w-full items-center justify-between bg-black/50 px-10 text-white">
        <div className="flex flex-1 justify-start">
          <Link
            className="border-b border-b-white pb-0 transition-all duration-300 hover:border-b-primary-dark hover:pb-0.5 hover:text-primary-dark"
            to="/gallerij"
          >
            Terug naar de galerij
          </Link>
        </div>
        <div className="flex flex-1 justify-center gap-4">
          <span className="flex items-center justify-center gap-1">
            Foto door{' '}
            <a
              className="border-b border-b-white pb-0 transition-all duration-300 hover:border-b-primary-dark hover:pb-0.5 hover:text-primary-dark"
              href="https://momenttom.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Momenttom
            </a>
          </span>
          <CopyrighText stylizeWeddingfest />
        </div>
        <div className="flex flex-1 justify-end">
          <ResizeButton fullScreen={fullScreen} setFullScreen={setFullScreen} />
        </div>
      </div>
    </div>
  );
}
