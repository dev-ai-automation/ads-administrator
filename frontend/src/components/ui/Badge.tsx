import { ReactNode } from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`${styles['badge']} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
