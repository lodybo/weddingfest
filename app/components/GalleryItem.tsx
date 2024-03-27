import { useIntersectionObserver } from '@uidotdev/usehooks';
import { Link } from '@remix-run/react';
import { Image } from '~/components/Image';

export function GalleryItem(props: { imageName: string }) {
  const [ref, entry] = useIntersectionObserver({
    threshold: 10,
    root: null,
    rootMargin: '500px',
  });

  console.log('entry', entry);

  return (
    <li
      className="group/image m-2 h-[200px] w-[200px] cursor-pointer overflow-hidden transition-opacity duration-300 hover:!opacity-100 group-hover/grid:opacity-80"
      ref={ref}
    >
      {entry && entry.isIntersecting && (
        <Link to={`/foto/${props.imageName}`}>
          <Image
            className="scale-100 transition-transform duration-300 group-hover/image:scale-105"
            src={`/image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${props.imageName}?w=200&h=200&fit=cover`}
            srcSet={`
                  /image/official/2023/ALL_HR_-_Bruiloft_Kaylee_&_Lody_-_momenttom/${props.imageName}?w=200&h=200&fit=cover  400w,
                `}
            sizes={`
                  400px
                `}
            width={200}
            height={200}
            alt={props.imageName}
          />
        </Link>
      )}
    </li>
  );
}
