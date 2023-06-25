type Props = {
  value?: string;
  name?: string;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RadioOption({
  value,
  name,
  defaultChecked,
  onChange,
}: Props) {
  return (
    <input
      className="text-cyan-700 outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
      type="radio"
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      onChange={onChange}
    />
  );
}
