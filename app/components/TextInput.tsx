import Input from './Input';
import { forwardRef } from 'react';

type Props = Omit<JSX.IntrinsicElements['input'], 'type' | 'ref'>;

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return <Input ref={ref} type="text" {...props} />;
  }
);
TextInput.displayName = 'TextInput';

export default TextInput;
