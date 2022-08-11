type Props = JSX.IntrinsicElements['button'] & {
  /**
   * The variant (color scheme) of the button.
   */
  variant?: 'normal' | 'primary' | 'success';
};

const variantStyles = new Map();
variantStyles.set('normal', 'bg-zinc-200 hover:bg-zinc-300');
variantStyles.set('primary', 'bg-cyan-200 hover:bg-cyan-400');
variantStyles.set('success', 'bg-zinc-200 hover:bg-emerald-300');

export default function Button({ children, variant = 'normal'}: Props) {

  return (
    <button className={ `${ variantStyles.get(variant) } px-8 py-4 text-slate-800 transition hover:text-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2` }>
      {children}
    </button>
  );
}
