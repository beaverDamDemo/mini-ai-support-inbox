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
        <p className="py-10 text-center text-sm text-[#65736b]" role="status">
          Loading messages...
        </p>
      ) : error ? (
        <div
          className="rounded-md border border-[#e4c7c3] bg-white p-6 text-sm text-[#8b3830]"
          role="alert"
        >
          <p>{error}</p>
          <button
            className="mt-3 font-medium underline underline-offset-4"
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
        <div className="rounded-md border border-dashed border-[#cbd7cf] bg-white px-6 py-16 text-center">
          <p className="font-medium text-[#202a24]">No messages yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#e6ebe7] overflow-hidden rounded-md border border-[#dce5df] bg-white">
          {messages.map((message) => (
            <li key={message.id}>
              <Link
                className="block space-y-3 px-5 py-4 hover:bg-[#f8faf8] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#245a44]"
                href={`/messages/${message.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="max-w-3xl whitespace-pre-wrap text-sm font-medium text-[#202a24]">
                    {message.customerMessage}
                  </p>
                  <time
                    className="shrink-0 text-xs text-[#65736b]"
                    dateTime={message.createdAt}
                  >
                    {new Intl.DateTimeFormat('en', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(message.createdAt))}
                  </time>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm text-[#65736b]">
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
