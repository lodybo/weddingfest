import Input from './Input';

type Props = Omit<JSX.IntrinsicElements['input'], 'type' | 'ref'>;

export default function EmailInput({ className, ...props }: Props) {
  return <Input type="email" {...props} />;
}
