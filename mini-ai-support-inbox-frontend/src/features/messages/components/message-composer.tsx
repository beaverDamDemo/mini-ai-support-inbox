'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeading } from '@/components/ui/page-heading';
import { createMessage } from '../api';

export function MessageComposer() {
  const router = useRouter();
  const [customerMessage, setCustomerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const message = await createMessage({
        customerMessage: customerMessage.trim(),
      });
      setCustomerMessage('');
      router.push(`/messages/${message.id}`);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not save this message.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <PageHeading title="New message" />

      <form className="gh-panel space-y-5 p-5 sm:p-7" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-foreground"
            htmlFor="customer-message"
          >
            Customer message
          </label>
          <textarea
            className="gh-textarea w-full resize-y text-sm"
            id="customer-message"
            maxLength={10000}
            onInput={(event) => setCustomerMessage(event.currentTarget.value)}
            placeholder="Paste the customer's message"
            required
            value={customerMessage}
          />
          <p className="text-right text-xs text-muted">
            {customerMessage.length}/10,000
          </p>
        </div>

        {error ? (
          <p
            className="rounded-md border border-danger-foreground/20 bg-danger-background px-3 py-2 text-sm text-danger-foreground"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link className="gh-button gh-button-secondary" href="/">
            Cancel
          </Link>
          <button
            className="gh-button gh-button-primary"
            disabled={submitting || customerMessage.trim().length === 0}
            type="submit"
          >
            {submitting ? 'Saving...' : 'Save message'}
          </button>
        </div>
      </form>
    </section>
  );
}
