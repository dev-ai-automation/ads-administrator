'use client';

import { useState } from 'react';
import { createClientAction } from '../actions';
import { Page } from '@/components/ui/Page';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FormGroup,
  Label,
  HelperText,
  ErrorMessage,
} from '@/components/ui/Form';

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
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
      const result = await createClientAction(payload as any);

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
    <Page.Container>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              New Client Onboarding
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              Set up a new workspace and connect your Meta Ads account.
            </p>
          </header>

          {generalError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                color: '#ef4444',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Client Name */}
            <FormGroup>
              <Label htmlFor="name">Client / Company Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                autoFocus
                error={!!fieldErrors['name']}
              />
              {fieldErrors['name'] && (
                <ErrorMessage>{fieldErrors['name']}</ErrorMessage>
              )}
              <HelperText>
                This will be the display name for the client workspace.
              </HelperText>
            </FormGroup>

            {/* Meta Ad Account ID */}
            <FormGroup>
              <Label htmlFor="meta_ad_account_id">Meta Ad Account ID</Label>
              <Input
                id="meta_ad_account_id"
                name="meta_ad_account_id"
                type="text"
                placeholder="e.g. act_123456789"
                value={formData.meta_ad_account_id}
                onChange={handleChange}
                disabled={isLoading}
                error={!!fieldErrors['meta_ad_account_id']}
              />
              {fieldErrors['meta_ad_account_id'] && (
                <ErrorMessage>{fieldErrors['meta_ad_account_id']}</ErrorMessage>
              )}
              <HelperText>Found in your Meta Business settings.</HelperText>
            </FormGroup>

            {/* Meta Access Token */}
            <FormGroup>
              <Label htmlFor="meta_access_token">Meta Access Token</Label>
              <Input
                id="meta_access_token"
                name="meta_access_token"
                type="password"
                placeholder="••••••••••••••••"
                value={formData.meta_access_token}
                onChange={handleChange}
                disabled={isLoading}
                error={!!fieldErrors['meta_access_token']}
              />
              {fieldErrors['meta_access_token'] && (
                <ErrorMessage>{fieldErrors['meta_access_token']}</ErrorMessage>
              )}
              <HelperText>
                System User Access Token with `ads_read` and `ads_management`
                permissions.
              </HelperText>
            </FormGroup>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button
                variant="secondary"
                href="/dashboard/clients"
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" style={{ flex: 2 }} disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page.Container>
  );
}