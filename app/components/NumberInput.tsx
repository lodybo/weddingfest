import Icon from '~/components/Icon';

type Props = JSX.IntrinsicElements['input'];

export default function NumberInput({
  className,
  type,
  step,
  ...props
}: Props) {
  return (
    <div className="flex w-full flex-row items-center justify-center border border-gray-300 pl-2 focus-within:ring focus-within:ring-primary focus-within:ring-offset-2 focus:border-gray-300">
      <Icon className="w-4 text-center" name="euro-sign" />
      <input
        type="number"
        className={`${className} w-full border-0 text-xl focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0`}
        step="0.01"
        {...props}
      />
    </div>
  );
}
