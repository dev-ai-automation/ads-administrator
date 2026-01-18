import { serverApi } from '@/lib/api/server';
import Link from 'next/link';
import styles from './page.module.css';

export default async function ClientsPage() {
    let clients;
    try {
        clients = await serverApi.clients.list();
    } catch (error) {
        console.error('Failed to fetch clients', error);
        clients = { items: [], total: 0 };
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Clients</h1>
                <Link href="/dashboard/clients/new" className={styles.addButton}>
                    + New Client
                </Link>
            </header>

            <div className={styles.grid}>
                {clients.items.length === 0 ? (
                    <div style={{ color: '#a1a1aa', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        No clients found. Click "New Client" to get started.
                    </div>
                ) : (
                    clients.items.map((client: any) => (
                        <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.clientName}>{client.name}</span>
                                    {client.active && <span className={styles.status}>Active</span>}
                                </div>
                                <div className={styles.metaId}>
                                    ID: {client.meta_ad_account_id || 'Not connected'}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
