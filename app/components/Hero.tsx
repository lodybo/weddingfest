import { Image } from '~/components/Image';

type Props = {
  /**
   * The size of the hero
   */
  size?: 'small' | 'large';
};

export default function Hero({ size = 'small' }: Props) {
  return (
    <Image
      className={`${
        size === 'small' ? 'h-40 object-[center_45%]' : 'h-[50vh] object-center'
      } w-full object-cover`}
      alt="Trouwfoto van het bruidspaar"
      src="/image/trouw2.webp?w=600"
      srcSet="/image/trouw2.webp?w=800  800w,
              /image/trouw2.webp?w=1200 1200w,
              /image/trouw2.webp?w=1600 1600w,
              /image/trouw2.webp?w=2000 2000w,
              /image/trouw2.webp?w=2400 2400w,
              /image/trouw2.webp?w=2800 2800w,
              /image/trouw2.webp?w=3200 3200w,
              /image/trouw2.webp?w=3600 3600w,
              /image/trouw2.webp?w=4000 4000w,
              /image/trouw2.webp?w=4400 4400w,
              /image/trouw2.webp?w=4800 4800w,
              "
      sizes="100vw"
    />
  );
}
