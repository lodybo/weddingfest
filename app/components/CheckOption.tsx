type Props = {
  label: string;
  name: string;
  value: string;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CheckOption({
  name,
  value,
  label,
  onChange,
  defaultChecked,
}: Props) {
  return (
    <div className="transition-duration-500 w-full border-2 border-transparent p-2 transition-all has-checked:border-primary-dark has-checked:px-3">
      <label className="flex flex-row items-center">
        <input
          className="h-8 w-8 text-cyan-400 focus:!ring-0 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          onChange={onChange}
        />
        <span className="ml-2 text-xl text-gray-700">{label}</span>
      </label>
    </div>
  );
}
