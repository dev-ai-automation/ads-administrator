import { serverApi } from '@/lib/api/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const clientId = parseInt(id, 10);

  if (isNaN(clientId)) {
    notFound();
  }

  let client;
  try {
    client = await serverApi.clients.get(clientId);
  } catch (error) {
    console.error(`Failed to fetch client ${clientId}`, error);
    notFound();
  }

  return (
    <Page.Container>
      <Link
        href="/dashboard/clients"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#666',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          transition: 'color 0.2s',
        }}
      >
        ← Back to Clients
      </Link>

      <Page.Header>
        <div>
          <Page.Title>{client.name}</Page.Title>
          <p style={{ color: '#666', margin: '0.5rem 0 0' }}>
            Client Workspace
          </p>
        </div>
        <div>
          {client.active ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="default">Inactive</Badge>
          )}
        </div>
      </Page.Header>

      <Page.Grid>
        {/* Configuration Card */}
        <Card>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              paddingBottom: '0.5rem',
            }}
          >
            Meta Configuration
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.25rem',
                fontWeight: 500,
              }}
            >
              Ad Account ID
            </label>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                background: 'rgba(0,0,0,0.05)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block',
                fontSize: '0.9rem',
              }}
            >
              {client.meta_ad_account_id || 'Not configured'}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#666',
                marginBottom: '0.25rem',
                fontWeight: 500,
              }}
            >
              Slug
            </label>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                background: 'rgba(0,0,0,0.05)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block',
                fontSize: '0.9rem',
              }}
            >
              {client.slug || '-'}
            </div>
          </div>
        </Card>

        {/* Metrics Placeholder */}
        <Card>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              paddingBottom: '0.5rem',
            }}
          >
            Performance Metrics
          </h2>
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Metrics dashboard coming soon...
          </p>
        </Card>
      </Page.Grid>
    </Page.Container>
  );
}