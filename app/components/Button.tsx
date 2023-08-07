import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { forwardRef } from 'react';

type JSXButtonProps = JSX.IntrinsicElements['button'];

type BaseProps = {
  /**
   * The variant (color scheme) of the button.
   */
  variant?: 'normal' | 'primary' | 'success' | 'danger' | 'warning';

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
  'bg-zinc-200 hover:bg-zinc-700 hover:text-slate-50'
);
variantStyles.set(
  'primary',
  'bg-cyan-200 hover:bg-cyan-400 hover:text-slate-50'
);
variantStyles.set(
  'success',
  'bg-zinc-200 hover:bg-emerald-300 hover:text-slate-50'
);
variantStyles.set(
  'danger',
  'bg-rose-200 hover:bg-rose-400 hover:text-slate-50'
);
variantStyles.set(
  'warning',
  'bg-yellow-200 hover:bg-yellow-400 hover:text-slate-50'
);

const sizes = new Map();
sizes.set('small', 'px-4 py-2 text-sm');
sizes.set('normal', 'px-8 py-4 text-md');
sizes.set('large', 'px-12 py-6 text-xl');

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = '',
    children,
    variant = 'normal',
    size = 'normal',
    ...props
  }: Props,
  ref
) {
  const classes = `${className} ${variantStyles.get(variant)} ${sizes.get(
    size
  )} rounded text-slate-800 transition focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`;
  if ('to' in props) {
    const { to = '' } = props;
    return (
      <Link to={to} className={`flex items-center justify-center ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={`${classes} rounded disabled:pointer-events-none disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-300`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
