'use client';

import { useState } from 'react';
import { createClientAction } from '../actions';
import styles from './page.module.css';
import Link from 'next/link';

export default function NewClientPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: '',
        meta_ad_account_id: '',
        meta_access_token: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneralError(null);
        setFieldErrors({});

        // 1. Basic client-side validation for UX
        if (!formData.name.trim()) {
            setFieldErrors({ name: 'Client name is required' });
            setIsLoading(false);
            return;
        }

        const payload = {
            ...formData,
            active: true,
            config: {},
        };

        try {
            // 2. Call Server Action
            const result = await createClientAction(payload);

            // 3. Handle Error (Success redirects automatically)
            if (result && !result.success) {
                if (result.errors) {
                    const flatErrors: Record<string, string> = {};
                    Object.entries(result.errors).forEach(([key, val]) => {
                        if (val && val.length > 0) {
                            flatErrors[key] = val[0] || '';
                        }
                    });
                    setFieldErrors(flatErrors);
                }
                if (result.message) {
                    setGeneralError(result.message);
                }
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Submission error:', err);
            setGeneralError('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>New Client Onboarding</h1>
                    <p className={styles.subtitle}>
                        Set up a new workspace and connect your Meta Ads account.
                    </p>
                </header>

                {generalError && (
                    <div className={styles.alert}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{generalError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Client Name */}
                    <div className={styles.group}>
                        <label htmlFor="name" className={styles.label}>
                            Client / Company Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Acme Corp"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                            disabled={isLoading}
                            autoFocus
                        />
                        {fieldErrors.name && (
                            <span className={styles.error}>{fieldErrors.name}</span>
                        )}
                        <p className={styles.helper}>
                            This will be the display name for the client workspace.
                        </p>
                    </div>

                    {/* Meta Ad Account ID */}
                    <div className={styles.group}>
                        <label htmlFor="meta_ad_account_id" className={styles.label}>
                            Meta Ad Account ID
                        </label>
                        <input
                            id="meta_ad_account_id"
                            name="meta_ad_account_id"
                            type="text"
                            placeholder="e.g. act_123456789"
                            value={formData.meta_ad_account_id}
                            onChange={handleChange}
                            className={styles.input}
                            disabled={isLoading}
                        />
                        {fieldErrors.meta_ad_account_id && (
                            <span className={styles.error}>{fieldErrors.meta_ad_account_id}</span>
                        )}
                        <p className={styles.helper}>
                            Found in your Meta Business settings.
                        </p>
                    </div>

                    {/* Meta Access Token */}
                    <div className={styles.group}>
                        <label htmlFor="meta_access_token" className={styles.label}>
                            Meta Access Token
                        </label>
                        <input
                            id="meta_access_token"
                            name="meta_access_token"
                            type="password"
                            placeholder="••••••••••••••••"
                            value={formData.meta_access_token}
                            onChange={handleChange}
                            className={styles.input}
                            disabled={isLoading}
                        />
                        {fieldErrors.meta_access_token && (
                            <span className={styles.error}>{fieldErrors.meta_access_token}</span>
                        )}
                        <p className={styles.helper}>
                            System User Access Token with `ads_read` and `ads_management` permissions.
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link href="/dashboard/clients" style={{ flex: 1 }}>
                            <button
                                type="button"
                                className={styles.button}
                                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className={styles.button}
                            style={{ flex: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Setting up...
                                </>
                            ) : (
                                'Complete Setup'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
