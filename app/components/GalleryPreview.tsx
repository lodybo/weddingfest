import { Image } from '~/components/Image';
import Button from '~/components/Button';
import Icon from '~/components/Icon';

type ImagePreview = {
  name: string;
  width: number;
  height: number;
  cols: string;
  rows: string;
};

type Props = {
  images: ImagePreview[];
};

export default function GalleryPreview({ images }: Props) {
  return (
    <ul className="grid grid-cols-6">
      {images.map(({ name, width, height, cols, rows }) => (
        <li className={`${cols} ${rows}`} key={name}>
          <Image
            src={`/image/official/2023/Kleine_Selectie/${name}?w=${width}&h=${height}&fit=cover`}
            srcSet={`
              /image/official/2023/Kleine_Selectie/${name}?w=${width}&h=${height}&fit=cover ${
              width * 2
            }w,
            `}
            sizes={`
              ${width * 2}px
            `}
            width={width}
            height={height}
            alt={name}
            loading="lazy"
          />
        </li>
      ))}
      <li className="col-span-4 row-span-1 grid items-center pl-3">
        <Button
          variant="primary"
          className="flex w-full flex-row gap-5 font-handwriting text-3xl"
          to="/gallerij"
        >
          Bekijk alle foto's <Icon className="mt-1" name="arrow-right" />
        </Button>
      </li>
    </ul>
  );
}
