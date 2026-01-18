/**
 * Home Page - Modern Landing page for Ads Administrator.
 */
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '2rem',
      }}
    >
      <main
        style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--foreground)',
            color: 'var(--background)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '2rem',
          }}
        >
          A
        </div>

        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: '1rem',
            lineHeight: 1,
          }}
        >
          Ads Administrator
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: '#666',
            marginBottom: '2.5rem',
            lineHeight: 1.5,
          }}
        >
          The minimalist platform for high-performance agencies. 
          Manage clients and track Meta Ads with surgical precision.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '4rem',
          }}
        >
          <Button href="/dashboard" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
            Open Dashboard
          </Button>
          <Button
            href="/docs"
            variant="secondary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            Documentation
          </Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <Card style={{ padding: '1.25rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Real-time Metrics
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
              Direct integration with Meta Graph API for instant data.
            </p>
          </Card>
          <Card style={{ padding: '1.25rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Multi-Client Support
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
              Seamlessly switch between workspaces and accounts.
            </p>
          </Card>
          <Card style={{ padding: '1.25rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Type-Safe Core
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
              Built with strict TypeScript and Zod for absolute reliability.
            </p>
          </Card>
        </div>
      </main>

      <footer
        style={{
          position: 'absolute',
          bottom: '2rem',
          fontSize: '0.75rem',
          color: '#999',
        }}
      >
        © 2026 Ads Administrator. Refined Architecture.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}