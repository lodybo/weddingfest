import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '~/components/Dialog';
import Button from '~/components/Button';
import EmailAddressesField from '~/components/EmailAddressesField';
import { useRef } from 'react';

type Props = {
  onSendHandler: (testRecipient: string) => void;
};

export default function TestEmailDialog({ onSendHandler }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendTrigger = () => {
    onSendHandler(inputRef.current!.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Test e-mail versturen</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Test e-mail versturen</DialogTitle>
        <DialogDescription>
          Probeer een e-mail uit door het te versturen naar jezelf (of een ander
          e-mailadres).
        </DialogDescription>

        <EmailAddressesField ref={inputRef} label="Test e-mail versturen aan" />

        <div className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button>Annuleren</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="primary" onClick={handleSendTrigger}>
              Test e-mail versturen
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
