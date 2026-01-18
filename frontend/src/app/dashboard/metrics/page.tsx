import { serverApi } from '@/lib/api/server';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
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
        <Card style={{ padding: 0 }}>
          <Table>
            <THead>
              <TR>
                <TH>Date</TH>
                <TH>Platform</TH>
                <TH align="right">Impressions</TH>
                <TH align="right">Clicks</TH>
                <TH align="right">Spend</TH>
                <TH align="right">Leads</TH>
              </TR>
            </THead>
            <TBody>
              {metrics?.items.length === 0 ? (
                <TR>
                  <TD colSpan={6} align="center">
                    <div style={{ padding: '3rem', color: '#999' }}>
                      No metrics found. Connect a Meta account to start syncing data.
                    </div>
                  </TD>
                </TR>
              ) : (
                metrics?.items.map((m: MetricResponse) => (
                  <TR key={m.id}>
                    <TD>{new Date(m.date).toLocaleDateString()}</TD>
                    <TD>
                      <Badge variant="default">{m.platform}</Badge>
                    </TD>
                    <TD align="right">{m.impressions.toLocaleString()}</TD>
                    <TD align="right">{m.clicks.toLocaleString()}</TD>
                    <TD align="right">${m.spend.toFixed(2)}</TD>
                    <TD align="right">{m.leads}</TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </Card>
      )}
    </Page.Container>
  );
}