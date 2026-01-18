import Link from 'next/link';
import { serverApi } from '@/lib/api/server';
import { ClientResponse } from '@/types/client';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function DashboardPage() {
  // Fetch clients - this uses Auth0 access token automatically
  let clients;
  let error: string | null = null;

  try {
    clients = await serverApi.clients.list({ page: 1, page_size: 10 });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load clients';
  }

  return (
    <Page.Container>
      <Page.Header>
        <div>
          <Page.Title>Dashboard</Page.Title>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Overview of your advertising clients and performance.
          </p>
        </div>
      </Page.Header>

      {error ? (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '1.5rem',
            color: '#ef4444',
          }}
        >
          <p>Error loading data: {error}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Make sure the backend is running and you have valid permissions.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <Card>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  {clients?.total ?? 0}
                </span>
                <span style={{ color: '#666', marginTop: '0.25rem' }}>
                  Total Clients
                </span>
              </div>
            </Card>
            <Card>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  {clients?.items.filter((c: ClientResponse) => c['active'])
                    .length ?? 0}
                </span>
                <span style={{ color: '#666', marginTop: '0.25rem' }}>
                  Active Clients
                </span>
              </div>
            </Card>
          </div>

          <Card>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Recent Clients
            </h2>
            {clients?.items.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
                No clients yet.{' '}
                <Link
                  href="/dashboard/clients/new"
                  style={{ color: '#0070f3', fontWeight: 500 }}
                >
                  Create your first client
                </Link>
                .
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {clients?.items.map((client: ClientResponse) => (
                  <li
                    key={client['id']}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Link
                      href={`/dashboard/clients/${client['id']}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 0',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{client['name']}</span>
                      {client['active'] ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="default">Inactive</Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </Page.Container>
  );
}