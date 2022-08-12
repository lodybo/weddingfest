import { useState } from 'react';
import Label from './Label';
import TextInput from './TextInput';
import Icon from './Icon';
import List from './List';

type Props = {
  value?: string[];
};

export default function PotluckField({ value }: Props) {
  const [dishes, setDishes] = useState<string[]>([]);
  const [newDish, setNewDish] = useState('');

  if (value && value.length) {
    setDishes([...value]);
  }

  const commitDish = () => {
    setDishes([...dishes, newDish]);

    setNewDish('');
  };

  const handleItemDelete = (item: string) => {
    const index = dishes.indexOf(item);

    if (index > -1) {
      const updatedDishes = [...dishes];
      updatedDishes.splice(index, 1);

      setDishes(updatedDishes);
    }
  };

  return (
    <>
      <input type="hidden" name="potluck" value={dishes} />
      <Label label="Ik/wij nemen mee voor de potluck:" flex>
        <div className="flex flex-1 flex-row gap-2">
          <TextInput
            className="flex-1"
            value={newDish}
            onChange={(evt) => setNewDish(evt.target.value)}
          />
          <button
            className="focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={commitDish}
            type="button"
          >
            <Icon
              className="flex-none cursor-pointer text-emerald-300 transition hover:text-emerald-400 "
              name="square-plus"
              sizes="l"
            />
          </button>
        </div>
      </Label>

      <List items={dishes} onDeleteItem={handleItemDelete} />
    </>
  );
}
