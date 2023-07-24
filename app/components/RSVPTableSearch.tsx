import Input from '~/components/Input';
import Label from '~/components/Label';
import Button from '~/components/Button';
import { useState } from 'react';
import Icon from '~/components/Icon';

type Props = {
  value?: string;
  onSearch: (searchTerm: string) => void;
};

export default function RSVPTableSearch({ value, onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState(value ?? '');

  return (
    <Label label="Zoek op naam">
      <div className="flex flex-row gap-1">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button size="small" onClick={() => onSearch(searchTerm)}>
          <Icon sizes="s" name="search" />
        </Button>
      </div>
    </Label>
  );
}
