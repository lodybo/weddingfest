import { NavLink } from '@remix-run/react';

type Props = {
  to: string;
  title: string;
};

export default function NavigationLink({ to, title }: Props) {
  return (
    <li>
      <NavLink
        className={({ isActive }) => `
          rounded
          px-2.5 py-1
          text-xl
          transition-all
          ${isActive ? 'bg-cyan-200' : 'bg-transparent hover:bg-cyan-100'}
        `}
        to={to}
      >
        {title}
      </NavLink>
    </li>
  );
}
