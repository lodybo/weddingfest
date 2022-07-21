import { useState } from 'react';

interface ListItem {
  value: string;
  isEditable: boolean;
}

type Props = {};

export default function ListInput({}: Props) {
  const [items, setItems] = useState<ListItem[]>([
    { value: 'Salade', isEditable: true },
  ]);

  return (
    <ul className="w-full list-inside list-disc">
      {items.map(({ value, isEditable }) => (
        <li
          key={value}
          className="caret-cyan-500 selection:bg-cyan-200 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2"
          contentEditable={isEditable}
        >
          {value}
        </li>
      ))}

      <li className="mt-10 list-none">
        <button
          className="group bg-transparent py-2 pr-2 transition hover:bg-emerald-100"
          onClick={() => setItems([...items, { value: '', isEditable: true }])}
        >
          <span className="mr-2 bg-emerald-100 py-2 px-4">+</span> Ik neem nog
          iets mee
        </button>
      </li>
    </ul>
  );
}
