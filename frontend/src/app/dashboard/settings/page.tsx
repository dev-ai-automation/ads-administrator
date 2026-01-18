import { serverApi } from '@/lib/api/server';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function SettingsPage() {
  let user;

  try {
    user = await serverApi.users.getProfile();
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    return (
      <Page.Container>
        <Page.Header>
          <Page.Title>Settings</Page.Title>
        </Page.Header>
        <Card>
          <p style={{ color: '#ef4444' }}>
            Failed to load user profile. Please try refreshing or logging in
            again.
          </p>
        </Card>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <Page.Header>
        <div>
          <Page.Title>Account Settings</Page.Title>
          <p style={{ color: '#666', margin: '0.5rem 0 0' }}>
            Manage your personal account information and security.
          </p>
        </div>
      </Page.Header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <Card>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              paddingBottom: '0.5rem',
            }}
          >
            Profile Information
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.25rem',
                fontWeight: 500,
              }}
            >
              Email Address
            </label>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {user.email || 'No email provided'}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.25rem',
                fontWeight: 500,
              }}
            >
              Auth0 User ID
            </label>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                background: 'rgba(0,0,0,0.05)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block',
                fontSize: '0.85rem',
              }}
            >
              {user.id}
            </div>
          </div>
        </Card>

        <Card>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              paddingBottom: '0.5rem',
            }}
          >
            Security & Permissions
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.permissions && user.permissions.length > 0 ? (
              user.permissions.map((perm) => (
                <Badge key={perm} variant="default">
                  {perm}
                </Badge>
              ))
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9rem' }}>
                No specific permissions assigned.
              </p>
            )}
          </div>
        </Card>
      </div>
    </Page.Container>
  );
}