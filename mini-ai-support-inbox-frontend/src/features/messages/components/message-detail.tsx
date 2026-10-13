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
          <Link
            className="text-sm font-medium text-[#4d5d53] underline underline-offset-4 hover:text-[#202a24]"
            href="/"
          >
            Back to inbox
          </Link>
        }
      />

      {loading ? (
        <p className="py-8 text-sm text-[#65736b]" role="status">
          Loading message...
        </p>
      ) : error ? (
        <p
          className="rounded-md border border-[#e4c7c3] bg-white p-5 text-sm text-[#8b3830]"
          role="alert"
        >
          {error}
        </p>
      ) : !message ? (
        <p className="rounded-md border border-[#dce5df] bg-white p-5 text-sm text-[#65736b]">
          Message not found.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MessageStatusPill
              approved={message.approved}
              category={message.category}
            />
            <time
              className="text-sm text-[#65736b]"
              dateTime={message.createdAt}
            >
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(message.createdAt))}
            </time>
          </div>

          <article className="space-y-3 rounded-md border border-[#dce5df] bg-white p-5 sm:p-7">
            <h2 className="text-sm font-semibold text-[#4d5d53]">
              Customer message
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-[#202a24]">
              {message.customerMessage}
            </p>
          </article>

          <article className="space-y-3 rounded-md border border-[#dce5df] bg-white p-5 sm:p-7">
            <h2 className="text-sm font-semibold text-[#4d5d53]">
              Response draft
            </h2>
            {message.generatedReply ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#202a24]">
                {message.generatedReply}
              </p>
            ) : (
              <p className="text-sm text-[#65736b]">No response draft yet.</p>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
