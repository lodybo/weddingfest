import type { Rsvp } from '~/models/rsvp.server';

type Props = {
  rsvp: Omit<Rsvp, 'createdAt' | 'updatedAt'>;
};

export default function Attendee({ rsvp: { name, potluck } }: Props) {
  const filteredPotluck = potluck.filter(Boolean);

  return (
    <>
      <p className="m-0">
        { name }
      </p>
      { filteredPotluck.length > 0 && (
        <small><em>Neemt mee: { filteredPotluck.join(', ')}</em></small>
      )}
    </>
  );
}
