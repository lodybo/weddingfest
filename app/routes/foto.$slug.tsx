import { type LoaderFunctionArgs } from '@remix-run/router';
import invariant from 'tiny-invariant';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Image } from '~/components/Image';
import { useState } from 'react';
import ResizeButton from '~/components/ResizeButton';
import CopyrightText from '~/components/CopyrightText';
import Icon from '~/components/Icon';
import { getSession } from '~/session.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, 'slug is required');

  const session = await getSession(request);
  if (!session.get('hasAccess')) {
    return redirect(`/inloggen?redirectTo=/foto/${slug}`);
  }

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
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-between bg-black/50 px-4 text-white md:h-10 lg:px-10">
        <div className="flex w-auto flex-initial justify-start sm:w-full sm:flex-1">
          <Link to="/gallerij">
            <span className="hidden border-b border-b-white pb-0 transition-all duration-300 hover:border-b-primary-dark hover:pb-0.5 hover:text-primary-dark sm:inline-block">
              Terug naar de galerij
            </span>
            <Icon
              name="arrow-left"
              className="inline-block sm:hidden"
              sizes="l"
            />
          </Link>
        </div>
        <div className="flex w-full flex-initial flex-col justify-center gap-2 sm:flex-1 md:flex-row lg:flex-row lg:gap-4">
          <span className="flex items-center justify-center gap-2.5 lg:gap-1">
            <span className="hidden whitespace-nowrap lg:inline-block">
              Foto door{' '}
            </span>
            <Icon className="inline-block lg:hidden" name="camera" />
            <a
              className="border-b border-b-white pb-0 transition-all duration-300 hover:border-b-primary-dark hover:pb-0.5 hover:text-primary-dark"
              href="https://momenttom.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Momenttom
            </a>
          </span>
          <CopyrightText stylizeWeddingfest />
        </div>
        <div className="flex flex-initial justify-end sm:flex-1">
          <ResizeButton fullScreen={fullScreen} setFullScreen={setFullScreen} />
        </div>
      </div>
    </div>
  );
}
