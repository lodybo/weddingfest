import Icon from '~/components/Icon';

type Props = {
  slug: string;
};

export default function TicketIcon({ slug }: Props) {
  return (
    <Icon
      name={
        slug === 'adult'
          ? 'person'
          : slug === 'child'
          ? 'child'
          : slug === 'baby'
          ? 'baby'
          : slug === 'camping'
          ? 'campground'
          : 'gift'
      }
    />
  );
}
