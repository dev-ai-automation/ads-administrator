import { serverApi } from '@/lib/api/server';
import Link from 'next/link';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

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
        // Assuming 404 from API or similar, but for now we'll just show not found
        // In a real app we might differentiate between 404 and 500
        notFound();
    }

    return (
        <div className={styles['container']}>
            <Link href="/dashboard/clients" className={styles['backLink']}>
                ← Back to Clients
            </Link>

            <header className={styles['header']}>
                <div>
                    <h1 className={styles['title']}>{client.name}</h1>
                    <p className={styles['subtitle']}>Client Workspace</p>
                </div>
                <div className={`${styles['status']} ${client.active ? styles['statusActive'] : styles['statusInactive']}`}>
                    {client.active ? 'Active' : 'Inactive'}
                </div>
            </header>

            <div className={styles['grid']}>
                {/* Configuration Card */}
                <div className={styles['card']}>
                    <h2 className={styles['sectionTitle']}>Meta Configuration</h2>

                    <div className={styles['field']}>
                        <label className={styles['label']}>Ad Account ID</label>
                        <div className={`${styles['value']} ${styles['mono']}`}>
                            {client.meta_ad_account_id || 'Not configured'}
                        </div>
                    </div>



                    <div className={styles['field']}>
                        <label className={styles['label']}>Slug</label>
                        <div className={`${styles['value']} ${styles['mono']}`}>
                            {client.slug || '-'}
                        </div>
                    </div>
                </div>

                {/* Metrics Placeholder */}
                <div className={styles['card']}>
                    <h2 className={styles['sectionTitle']}>Performance Metrics</h2>
                    <p style={{ color: '#a1a1aa' }}>
                        Metrics dashboard coming soon...
                    </p>
                    {/* 
                      TODO: Implement Metrics Chart Component here.
                      We will fetch metrics using serverApi.metrics.getSummary(clientId)
                    */}
                </div>
            </div>
        </div>
    );
}
