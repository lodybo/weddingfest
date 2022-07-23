import Icon from '~/components/Icon';

type Props = {
  items: string[];
  onDeleteItem: (item: string) => void;
};

export default function ListInput({ items, onDeleteItem }: Props) {
  return (
    <ul className="w-full list-inside list-disc pl-10">
      {items.map((item) => (
        <li key={item} className="group">
          <span className="inline-flex flex-row gap-2">
            {item}
            <button onClick={() => onDeleteItem(item)} type="button">
              <Icon
                className="hidden cursor-pointer text-slate-300 transition hover:text-red-300 group-hover:block"
                name="trash"
              />
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
