import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CenteredContentLayout({ children }: Props) {
  return (
    <div className="flex flex-1 flex-col place-content-center place-items-center gap-4">
      {children}
    </div>
  );
}
