import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Prose({ children }: Props) {
  return (
    <div
      className="
    prose-nord
    prose
    prose-sm
    dark:prose-invert
    sm:prose-base
    md:prose-lg
    xl:prose-2xl
    prose-a:border-b-2
    prose-a:border-b-cyan-200
    prose-a:pb-0.5
    prose-a:no-underline
    prose-a:transition-all
    hover:prose-a:pb-1.5
  "
    >
      {children}
    </div>
  );
}
