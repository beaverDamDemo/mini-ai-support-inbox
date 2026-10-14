'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeading } from '@/components/ui/page-heading';
import { getMessages } from '../api';
import type { Message } from '../types';
import { MessageStatusPill } from './message-status-pill';

export function MessageInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    getMessages()
      .then((result) => {
        if (isCurrent) setMessages(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Could not load messages.',
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  return (
    <section className="space-y-6">
      <PageHeading title="Inbox" />

      {loading ? (
        <p className="py-10 text-center text-sm text-muted" role="status">
          Loading messages...
        </p>
      ) : error ? (
        <div
          className="gh-panel p-6 text-sm text-danger-foreground"
          role="alert"
        >
          <p>{error}</p>
          <button
            className="gh-link mt-3"
            onClick={() => {
              setError(null);
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
            type="button"
          >
            Retry
          </button>
        </div>
      ) : messages.length === 0 ? (
        <div className="gh-panel border-dashed px-6 py-16 text-center">
          <p className="font-medium text-foreground">No messages yet</p>
        </div>
      ) : (
        <ul className="gh-panel divide-y divide-border overflow-hidden">
          {messages.map((message) => (
            <li key={message.id}>
              <Link
                className="gh-message-row space-y-3"
                href={`/messages/${message.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="max-w-3xl whitespace-pre-wrap text-sm font-medium text-foreground">
                    {message.customerMessage}
                  </p>
                  <time
                    className="shrink-0 text-xs text-muted"
                    dateTime={message.createdAt}
                  >
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(message.createdAt))}
                  </time>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm text-muted">
                    {message.generatedReply || 'No response draft yet'}
                  </p>
                  <MessageStatusPill
                    approved={message.approved}
                    category={message.category}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
