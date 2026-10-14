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
      <PageHeading
        title="New message"
        action={
          <Link
            className="text-sm font-medium text-[#4d5d53] underline underline-offset-4 hover:text-[#202a24]"
            href="/"
          >
            Back to inbox
          </Link>
        }
      />

      <form
        className="space-y-5 rounded-md border border-[#dce5df] bg-white p-5 sm:p-7"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-[#202a24]"
            htmlFor="customer-message"
          >
            Customer message
          </label>
          <textarea
            className="min-h-48 w-full resize-y rounded-md border border-[#cbd7cf] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#39785b] focus:ring-2 focus:ring-[#39785b]/20"
            id="customer-message"
            maxLength={10000}
            onInput={(event) => setCustomerMessage(event.currentTarget.value)}
            placeholder="Paste the customer's message"
            required
            value={customerMessage}
          />
          <p className="text-right text-xs text-[#65736b]">
            {customerMessage.length}/10,000
          </p>
        </div>

        {error ? (
          <p
            className="rounded-md bg-[#fbefed] px-3 py-2 text-sm text-[#8b3830]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-[#4d5d53] hover:bg-[#f3f6f4]"
            href="/"
          >
            Cancel
          </Link>
          <button
            className="rounded-md bg-[#245a44] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#194832] disabled:cursor-not-allowed disabled:opacity-60"
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
