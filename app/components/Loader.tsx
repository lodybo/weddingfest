import type { Props as IconProps } from '~/components/Icon';
import Icon from '~/components/Icon';

type Props = {
  size?: IconProps['sizes'];
};

export default function Loader({ size }: Props) {
  return <Icon name="spinner" faClasses="fa-spin" sizes={size} />;
}
