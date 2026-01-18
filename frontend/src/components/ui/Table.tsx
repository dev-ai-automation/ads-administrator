import { ReactNode } from 'react';
import styles from './Table.module.scss';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className={styles['wrapper']}>
      <table className={styles['table']}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: ReactNode }) {
  return <tr className={styles['tr']}>{children}</tr>;
}

export function TH({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' | 'center' }) {
  return (
    <th className={styles['th']} style={{ textAlign: align }}>
      {children}
    </th>
  );
}

export function TD({ children, align = 'left', colSpan }: { children: ReactNode; align?: 'left' | 'right' | 'center'; colSpan?: number }) {
  return (
    <td className={styles['td']} style={{ textAlign: align, fontWeight: 'normal' }} colSpan={colSpan}>
      {children}
    </td>
  );
}
