import type { MouseEvent } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import Icon from '~/components/Icon';

type InputProps = JSX.IntrinsicElements['textarea'];

export const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [textareaHeight, setTextareaHeight] = useState(200); // Initial textarea height
    const [isResizing, setIsResizing] = useState(false); // State to track if resizing is in progress
    const resizeContainerRef = useRef<HTMLButtonElement>(null); // Ref for the resize container div

    const handleMouseDown = (e: MouseEvent) => {
      if (e.buttons === 1) {
        setIsResizing(true); // Set resizing state to true when mouse down
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false); // Set resizing state to false when mouse up
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        // Only update textarea height if resizing is in progress
        const newHeight = textareaHeight + e.movementY; // Calculate new textarea height based on mouse movement
        setTextareaHeight(newHeight >= 50 ? newHeight : 50); // Set minimum height of textarea to 50 pixels
      }
    };

    useEffect(() => {
      const container = resizeContainerRef.current;

      if (!container) return;

      const handleMouseLeave = () => {
        if (isResizing) {
          // Set resizing state to false when mouse leaves the container
          setIsResizing(false);
        }
      };

      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [isResizing]);

    return (
      <div className="w-full space-y-2">
        <textarea
          ref={ref}
          className={`
            block
            w-full
            border border-gray-300
            px-4
            py-2
            shadow-sm
            focus:border-gray-300
            focus:outline-none
            focus-visible:ring
            focus-visible:ring-primary focus-visible:ring-offset-2
            ${className}
          `}
          {...props}
          style={{ height: textareaHeight }}
        />
        <button
          ref={resizeContainerRef}
          type="button"
          className="flex w-full cursor-pointer select-none items-center justify-center bg-cyan-100 text-sm transition hover:bg-cyan-200 focus:outline-none
            focus-visible:ring
            focus-visible:ring-primary focus-visible:ring-offset-2"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <Icon name="arrows-up-down" />
        </button>
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
