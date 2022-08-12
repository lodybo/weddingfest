import type { Rsvp } from '~/models/rsvp.server';

import Icon from '~/components/Icon';
import Button from '~/components/Button';
import { Link } from '@remix-run/react';

type Props = {
  rsvp: Omit<Rsvp, 'createdAt' | 'updatedAt'>;
};

export default function Attendee({ rsvp: { id, name, potluck } }: Props) {
  const filteredPotluck = potluck.filter(Boolean);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="">
        <p className="m-0">
          { name }
        </p>

        { filteredPotluck.length > 0 && (
          <small><em>Neemt mee: { filteredPotluck.join(', ')}</em></small>
        )}
      </div>

      <Button variant="primary" size="small">
        <Link to={`/edit/${id}`}>
          <Icon name="pen-to-square" />
        </Link>
      </Button>
    </div>
  );
}
