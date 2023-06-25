import Input from './Input';

type Props = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  showPassword?: boolean;
};

export default function PasswordInput({
  showPassword = false,
  className,
  ...props
}: Props) {
  return <Input type={showPassword ? 'text' : 'password'} {...props} />;
}
