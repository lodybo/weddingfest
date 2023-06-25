import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import type { FitEnum } from 'sharp';

// Inspired by https://github.com/remix-run/examples/blob/main/image-resize/app/components/image.tsx
interface BaseImageProps extends ComponentPropsWithRef<'img'> {
  /**
   * A path within the assets/images directory, can be a nested path.
   */
  src: string;

  /**
   * The alt text for the image.
   */
  alt: string;
}

interface SingleSrcImageProps extends BaseImageProps {
  /**
   * The width of the image.
   * At least width or height should be passed.
   */
  width?: number;
  /**
   * The height of the image.
   * At least width or height should be passed.
   */
  height?: number;

  /**
   * The unit of the width and height.
   * Defaults to pixels.
   */
  unit?: 'px' | 'rem';

  /**
   * The fit of the image.
   * Defaults to 'contain'.
   */
  fit?: keyof FitEnum;

  srcSet?: never;
  sizes?: never;
}

interface SrcSetImageProps extends BaseImageProps {
  /**
   * The sizes of the image.
   */
  srcSet?: string;

  sizes?: string;
}

export type ImageProps = SingleSrcImageProps | SrcSetImageProps;

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, srcSet, ...props }, forwardedRef) => {
    if (srcSet) {
      const { sizes } = props;
      return (
        <img
          ref={forwardedRef}
          alt={alt}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          {...props}
        />
      );
    }

    const { width, height, unit = 'px', fit } = props as SingleSrcImageProps;
    const query = new URLSearchParams();

    let unitMultiplier = 1;
    if (unit === 'rem') {
      unitMultiplier = parseFloat(
        typeof document === 'undefined'
          ? '16'
          : getComputedStyle(document.documentElement).fontSize
      );
    }

    if (width) {
      const w = width * unitMultiplier;
      query.set('w', w.toString());
    }
    if (height) {
      const h = height * unitMultiplier;
      query.set('h', h.toString());
    }
    if (fit) {
      query.set('fit', fit.toString());
    }
    return (
      <img
        ref={forwardedRef}
        alt={alt}
        src={`/image/${src}?${query.toString()}`}
        {...{ width, height, ...props }}
      />
    );
  }
);

Image.displayName = 'Image';
