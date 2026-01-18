import { ReactNode, LabelHTMLAttributes } from 'react';
import styles from './Form.module.scss';

export function FormGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles['group']} ${className}`}>{children}</div>;
}

export function Label({ children, className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`${styles['label']} ${className}`} {...props}>{children}</label>;
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className={styles['helper']}>{children}</p>;
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className={styles['error']}>{children}</p>;
}
