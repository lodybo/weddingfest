import { type LoaderFunctionArgs } from '@remix-run/router';
import invariant from 'tiny-invariant';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Image } from '~/components/Image';

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, 'slug is required');

  return json({ slug });
}

// TODO: add password protection to this page.
// Intercepted routes: https://github.com/remix-run/remix/discussions/8731#discussioncomment-8436767
export default function PhotoPage() {
  const { slug } = useLoaderData<typeof loader>();

  return (
    <>
      <Link to="/gallerij">Terug naar de galerij</Link>
      <Image
        src={`/image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=200&h=200&fit=cover`}
        srcSet={`
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=200&h=200&fit=cover  400w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=400&h=400&fit=cover  800w,
          /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${slug}?w=600&h=600&fit=cover 1200w,
        `}
        sizes={`
          400px
          800px
          1200px
        `}
        alt={slug}
      />
    </>
  );
}
