import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Icon from '~/components/Icon';

type DialogProps = DialogPrimitive.DialogContentProps & {
  onCloseHandler?: () => void;
};

export const DialogContent = forwardRef<HTMLDivElement, DialogProps>(
  ({ children, onCloseHandler, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-500/50" />
      <DialogPrimitive.Content
        className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-screen-md translate-x-[-50%] translate-y-[-50%] space-y-4 overflow-y-scroll rounded-md bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        {...props}
        ref={forwardedRef}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-[20px] top-[20px] text-xl"
          aria-label="Close"
          onClick={onCloseHandler}
        >
          <Icon name="times" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);
DialogContent.displayName = 'Dialog.Content';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogClose = DialogPrimitive.Close;

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <DialogPrimitive.Title className="font-handwriting text-3xl">
    {children}
  </DialogPrimitive.Title>
);

export const DialogDescription = ({ children }: { children: ReactNode }) => (
  <DialogPrimitive.Description className="text-gray-500">
    {children}
  </DialogPrimitive.Description>
);
