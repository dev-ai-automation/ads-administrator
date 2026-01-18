import { serverApi } from '@/lib/api/server';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MetricResponse } from '@/types/metric';

export const dynamic = 'force-dynamic';

export default async function MetricsPage() {
  let metrics;
  let error: string | null = null;

  try {
    metrics = await serverApi.metrics.list({ page: 1, page_size: 50 });
  } catch (err) {
    console.error('Failed to fetch metrics', err);
    error = err instanceof Error ? err.message : 'Failed to load metrics';
  }

  return (
    <Page.Container>
      <Page.Header>
        <div>
          <Page.Title>Metrics</Page.Title>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Performance data across all connected platforms.
          </p>
        </div>
      </Page.Header>

      {error ? (
        <Card>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </Card>
      ) : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: 500 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666', fontWeight: 500 }}>Platform</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: 500 }}>Impressions</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: 500 }}>Clicks</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: 500 }}>Spend</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#666', fontWeight: 500 }}>Leads</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                      No metrics found. Connect a Meta account to start syncing data.
                    </td>
                  </tr>
                ) : (
                  metrics?.items.map((m: MetricResponse) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: '1rem' }}>{new Date(m.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <Badge variant="default">{m.platform}</Badge>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>{m.impressions.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>{m.clicks.toLocaleString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>${m.spend.toFixed(2)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>{m.leads}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Page.Container>
  );
}
