import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${styles['input']} ${error ? styles['error'] : ''} ${className}`}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
