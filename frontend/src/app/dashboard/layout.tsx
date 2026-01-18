/**
 * Dashboard Layout - Protected layout for authenticated routes.
 *
 * This layout:
 * - Wraps all /dashboard/* routes
 * - Provides navigation and user context
 * - Is protected by middleware (redirects to login if not authenticated)
 *
 * IMPORTANT: Must use dynamic rendering because it calls Auth0.getSession()
 */
import { ReactNode } from 'react';
import { auth0, isAuth0Configured } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.scss';

// Force dynamic rendering - required for Auth0 session access
export const dynamic = 'force-dynamic';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Check if Auth0 is configured
  if (!isAuth0Configured()) {
    return (
      <div className={styles['layout']}>
        <header className={styles['header']}>
          <nav className={styles['nav']}>
            <div className={styles['logo']}>
              <strong>Ads Administrator</strong>
            </div>
            <div className={styles['user']}>
              <span>Auth0 not configured</span>
            </div>
          </nav>
        </header>
        <main className={styles['main']}>
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', color: '#92400e' }}>
              Auth0 Configuration Required
            </h2>
            <p style={{ margin: 0, color: '#78350f' }}>
              Please set the following environment variables in your{' '}
              <code>.env.local</code> file:
            </p>
            <ul style={{ marginTop: '0.5rem', color: '#78350f' }}>
              <li>AUTH0_DOMAIN</li>
              <li>AUTH0_CLIENT_ID</li>
              <li>AUTH0_CLIENT_SECRET</li>
              <li>AUTH0_BASE_URL</li>
            </ul>
          </div>
          {children}
        </main>
      </div>
    );
  }

  // Get session (middleware already protects this route)
  const session = await auth0.getSession();

  if (!session) {
    // This shouldn't happen due to middleware, but just in case
    redirect('/auth/login');
  }

  const user = session.user;

  return (
    <div className={styles['layout']}>
      <header className={styles['header']}>
        <nav className={styles['nav']}>
          <div className={styles['logo']}>
            <strong>Ads Administrator</strong>
          </div>
          <ul className={styles['navLinks']}>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/dashboard/clients">Clients</Link>
            </li>
            <li>
              <Link href="/dashboard/metrics">Metrics</Link>
            </li>
          </ul>
          <div className={styles['user']}>
            <span>{user['email']}</span>
            <a href="/auth/logout" className={styles['logout']}>
              Logout
            </a>
          </div>
        </nav>
      </header>
      <main className={styles['main']}>{children}</main>
    </div>
  );
}
