import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  href?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  href, 
  className = '', 
  ...props 
}: ButtonProps) {
  const classes = `${styles['button']} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
