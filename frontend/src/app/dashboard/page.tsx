/**
 * Dashboard Home Page - Overview of client metrics.
 * 
 * This is a Server Component that fetches data using the serverApi.
 */
import { serverApi } from '@/lib/api/server';
import styles from './page.module.css';

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
        <div className={styles['container']}>
            <header className={styles['pageHeader']}>
                <h1>Dashboard</h1>
                <p>Overview of your advertising clients and performance.</p>
            </header>

            {error ? (
                <div className={styles['error']}>
                    <p>Error loading data: {error}</p>
                    <p>Make sure the backend is running and you have valid permissions.</p>
                </div>
            ) : (
                <>
                    <section className={styles['stats']}>
                        <div className={styles['statCard']}>
                            <span className={styles['statValue']}>{clients?.total ?? 0}</span>
                            <span className={styles['statLabel']}>Total Clients</span>
                        </div>
                        <div className={styles['statCard']}>
                            <span className={styles['statValue']}>
                                {clients?.items.filter(c => c['active']).length ?? 0}
                            </span>
                            <span className={styles['statLabel']}>Active Clients</span>
                        </div>
                    </section>

                    <section className={styles['clientsSection']}>
                        <h2>Recent Clients</h2>
                        {clients?.items.length === 0 ? (
                            <p className={styles['empty']}>
                                No clients yet. <a href="/dashboard/clients/new">Create your first client</a>.
                            </p>
                        ) : (
                            <ul className={styles['clientList']}>
                                {clients?.items.map(client => (
                                    <li key={client['id']} className={styles['clientItem']}>
                                        <a href={`/dashboard/clients/${client['id']}`}>
                                            <strong>{client['name']}</strong>
                                            <span className={client['active'] ? styles['active'] : styles['inactive']}>
                                                {client['active'] ? 'Active' : 'Inactive'}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
