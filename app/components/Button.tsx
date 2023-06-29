import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';

type JSXButtonProps = JSX.IntrinsicElements['button'];

type BaseProps = {
  /**
   * The variant (color scheme) of the button.
   */
  variant?: 'normal' | 'primary' | 'success';

  /**
   * The size of the button.
   */
  size?: 'small' | 'normal' | 'large';
};

interface ButtonProps extends JSXButtonProps, BaseProps {
  to?: never;
}

interface ButtonLinkProps extends LinkProps, BaseProps {}

type Props = ButtonProps | ButtonLinkProps;

const variantStyles = new Map();
variantStyles.set(
  'normal',
  'bg-zinc-200 hover:bg-zinc-300 hover:text-slate-900'
);
variantStyles.set(
  'primary',
  'bg-cyan-200 hover:bg-cyan-400 hover:text-slate-50'
);
variantStyles.set(
  'success',
  'bg-zinc-200 hover:bg-emerald-300 hover:text-slate-50'
);

const sizes = new Map();
sizes.set('small', 'px-4 py-2 text-sm');
sizes.set('normal', 'px-8 py-4 text-md');
sizes.set('large', 'px-12 py-6 text-xl');

export default function Button({
  className = '',
  children,
  variant = 'normal',
  size = 'normal',
  ...props
}: Props) {
  const classes = `${className} ${variantStyles.get(variant)} ${sizes.get(
    size
  )} text-slate-800 transition focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`;
  if ('to' in props) {
    const { to = '' } = props;
    return (
      <Link to={to} className={`block text-center ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${classes} disabled:pointer-events-none disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-300`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
