import { serverApi } from '@/lib/api/server';
import { ClientResponse } from '@/types/client';
import Link from 'next/link';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default async function ClientsPage() {
  let clients;
  try {
    clients = await serverApi.clients.list();
  } catch (error) {
    console.error('Failed to fetch clients', error);
    clients = { items: [], total: 0 };
  }

  return (
    <Page.Container>
      <Page.Header>
        <Page.Title>Clients</Page.Title>
        <Button href="/dashboard/clients/new">+ New Client</Button>
      </Page.Header>

      <Page.Grid>
        {clients.items.length === 0 ? (
          <div
            style={{
              color: '#666',
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
            }}
          >
            No clients found. Click &quot;New Client&quot; to get started.
          </div>
        ) : (
          clients.items.map((client: ClientResponse) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {client.name}
                  </span>
                  {client.active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="default">Inactive</Badge>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  ID: {client.meta_ad_account_id || 'Not connected'}
                </div>
              </Card>
            </Link>
          ))
        )}
      </Page.Grid>
    </Page.Container>
  );
}