import type { ComponentProps } from 'react';
import { Link } from '@remix-run/react';

type Props = ComponentProps<typeof Link>;

export default function Anchor({ className, to, children, ...props }: Props) {
  return (
    <Link
      className={`${
        className || ''
      } border-b-2 border-b-cyan-200 pb-0.5 text-black transition-all hover:border-b-cyan-500 hover:text-cyan-500`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}
