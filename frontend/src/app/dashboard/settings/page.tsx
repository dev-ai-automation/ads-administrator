import { serverApi } from '@/lib/api/server';
import styles from './page.module.css';

export default async function SettingsPage() {
  let user;

  try {
    user = await serverApi.users.getProfile();
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    return (
      <div className={styles['container']}>
        <h1 className={styles['title']}>Settings</h1>
        <div className={styles['card']}>
          <p style={{ color: '#ef4444' }}>
            Failed to load user profile. Please try refreshing or logging in
            again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['container']}>
      <header>
        <h1 className={styles['title']}>Account Settings</h1>
        <p className={styles['subtitle']}>
          Manage your personal account information.
        </p>
      </header>

      <div className={styles['card']}>
        <div className={styles['section']}>
          <h2 className={styles['sectionHeader']}>Profile Information</h2>

          <div className={styles['grid']}>
            <div className={styles['field']}>
              <span className={styles['label']}>Email Address</span>
              <div className={styles['value']}>
                {user.email || 'No email provided'}
              </div>
            </div>

            <div className={styles['field']}>
              <span className={styles['label']}>Auth0 User ID</span>
              <div
                className={styles['value']}
                style={{ fontFamily: 'monospace' }}
              >
                {user.id}
              </div>
            </div>
          </div>
        </div>

        <div className={styles['section']} style={{ marginBottom: 0 }}>
          <h2 className={styles['sectionHeader']}>Permissions</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.permissions && user.permissions.length > 0 ? (
              user.permissions.map((perm) => (
                <span key={perm} className={styles['roleTag']}>
                  {perm}
                </span>
              ))
            ) : (
              <span
                className={styles['roleTag']}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#a1a1aa',
                  border: 'none',
                }}
              >
                No specific permissions
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
