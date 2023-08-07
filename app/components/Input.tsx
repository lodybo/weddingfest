import { forwardRef } from 'react';

type Props = Omit<JSX.IntrinsicElements['input'], 'ref'> & {
  ref?: React.Ref<HTMLInputElement>;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${className} w-full border border-gray-300 focus:border-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export default Input;
