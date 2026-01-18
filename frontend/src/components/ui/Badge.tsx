import { ReactNode, CSSProperties } from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'default';
  className?: string;
  style?: CSSProperties;
}

export function Badge({ children, variant = 'default', className = '', style }: BadgeProps) {
  return (
    <span 
      className={`${styles['badge']} ${styles[variant]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
