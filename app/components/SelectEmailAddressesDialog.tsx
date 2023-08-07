import { useRef } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import type { User } from '@prisma/client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '~/components/Dialog';
import Button from '~/components/Button';
import CheckOption from '~/components/CheckOption';

type Props = {
  users: SerializeFrom<User>[];
  selectedRecipientsCallback: (recipients: string[]) => void;
};

export default function SelectEmailAddressesDialog({
  users,
  selectedRecipientsCallback,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-10 self-end"
          variant="primary"
          size="small"
          type="button"
        >
          Kiezen
        </Button>
      </DialogTrigger>

      <DialogContent
        onCloseHandler={() => {
          selectedRecipientsCallback([]);
        }}
      >
        <DialogTitle>Kies e-mailadressen</DialogTitle>
        <DialogDescription>
          Kies hieronder één of meerdere e-mailadressen om te mailen
        </DialogDescription>

        <form ref={formRef}>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <CheckOption
                  label={`${user.name} (${user.email})`}
                  name="email-addresses"
                  value={user.email}
                />
              </li>
            ))}
          </ul>
        </form>

        <div className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button
              size="small"
              onClick={() => {
                selectedRecipientsCallback([]);
              }}
            >
              Annuleren
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                const formData = new FormData(formRef.current!);
                const selectedRecipients = formData.getAll('email-addresses');
                selectedRecipientsCallback(selectedRecipients as string[]);
              }}
            >
              Kies adressen
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
