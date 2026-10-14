'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeading } from '@/components/ui/page-heading';
import { getMessage } from '../api';
import type { Message } from '../types';
import { MessageStatusPill } from './message-status-pill';

type MessageDetailProps = {
  messageId: string;
};

export function MessageDetail({ messageId }: MessageDetailProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getMessage(messageId)
      .then((result) => {
        if (isCurrent) setMessage(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Could not load this message.',
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [messageId]);

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <PageHeading
        title={`Message #${messageId}`}
        action={
          <Link className="gh-link text-sm" href="/">
            Back to inbox
          </Link>
        }
      />

      {loading ? (
        <p className="py-8 text-sm text-muted" role="status">
          Loading message...
        </p>
      ) : error ? (
        <p
          className="gh-panel border-danger-foreground/20 p-5 text-sm text-danger-foreground"
          role="alert"
        >
          {error}
        </p>
      ) : !message ? (
        <p className="gh-panel p-5 text-sm text-muted">Message not found.</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MessageStatusPill
              approved={message.approved}
              category={message.category}
            />
            <time className="text-sm text-muted" dateTime={message.createdAt}>
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(message.createdAt))}
            </time>
          </div>

          <article className="gh-panel space-y-3 p-5 sm:p-7">
            <h2 className="text-sm font-semibold text-muted">
              Customer message
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {message.customerMessage}
            </p>
          </article>

          <article className="gh-panel space-y-3 p-5 sm:p-7">
            <h2 className="text-sm font-semibold text-muted">Response draft</h2>
            {message.generatedReply ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {message.generatedReply}
              </p>
            ) : (
              <p className="text-sm text-muted">No response draft yet.</p>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
