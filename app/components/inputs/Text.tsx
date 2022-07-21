type Props = Omit<JSX.IntrinsicElements['input'], 'type' | 'className'>;

export default function TextInput({ ...props }: Props) {
  return (
    <input
      className="w-full focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2"
      type="text"
      {...props}
    />
  );
}
