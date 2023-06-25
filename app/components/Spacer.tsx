type Props = {
  size?: 'small' | 'medium' | 'large';
};

export default function Spacer({ size = 'small' }: Props) {
  return (
    <div
      className={size === 'small' ? 'h-8' : size === 'medium' ? 'h-16' : 'h-24'}
    />
  );
}
