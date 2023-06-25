import type { Rsvp } from '~/models/rsvp.server';

import Icon from '~/components/Icon';
import Button from '~/components/Button';
import { Link } from '@remix-run/react';

type Props = {
  rsvp: Omit<Rsvp, 'createdAt' | 'updatedAt'>;
};

export default function Attendee({ rsvp: { id, name } }: Props) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="">
        <p className="m-0">{name}</p>
      </div>

      <div className="ml-auto flex h-full flex-row gap-2">
        <Link to={`/edit/${id}`}>
          <Button variant="primary" size="small">
            <Icon name="pen-to-square" />
          </Button>
        </Link>

        <Link to={`/delete/${id}`}>
          <Button size="small">
            <Icon name="trash" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
