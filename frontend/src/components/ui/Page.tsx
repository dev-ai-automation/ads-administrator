import { ReactNode } from 'react';
import styles from './Page.module.scss';

export function Container({ children }: { children: ReactNode }) {
  return <div className={styles['container']}>{children}</div>;
}

export function Header({ children }: { children: ReactNode }) {
  return <header className={styles['header']}>{children}</header>;
}

export function Title({ children }: { children: ReactNode }) {
  return <h1 className={styles['title']}>{children}</h1>;
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className={styles['grid']}>{children}</div>;
}

export const Page = { Container, Header, Title, Grid };
