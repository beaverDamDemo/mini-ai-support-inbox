'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeading } from '@/components/ui/page-heading';
import { approveMessageReply, getMessage, updateMessageReply } from '../api';
import type { Message } from '../types';
import { MessageStatusPill } from './message-status-pill';

type MessageDetailProps = {
  messageId: string;
};

export function MessageDetail({ messageId }: MessageDetailProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');
  const [savingReply, setSavingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

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

  function startEditingReply() {
    setReplyDraft(message?.generatedReply ?? '');
    setReplyError(null);
    setEditingReply(true);
  }

  async function handleSaveReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingReply(true);
    setReplyError(null);

    try {
      const updatedMessage = await updateMessageReply(messageId, replyDraft);
      setMessage(updatedMessage);
      setEditingReply(false);
    } catch (requestError: unknown) {
      setReplyError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not save this response.',
      );
    } finally {
      setSavingReply(false);
    }
  }

  async function handleApproveReply() {
    setSavingReply(true);
    setReplyError(null);

    try {
      const updatedMessage = await approveMessageReply(messageId);
      setMessage(updatedMessage);
    } catch (requestError: unknown) {
      setReplyError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not approve this response.',
      );
    } finally {
      setSavingReply(false);
    }
  }

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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-muted">
                Response draft
              </h2>
              {!editingReply ? (
                <div className="flex flex-wrap gap-2">
                  {!message.approved && message.generatedReply?.trim() ? (
                    <button
                      className="gh-button gh-button-primary"
                      disabled={savingReply}
                      onClick={handleApproveReply}
                      type="button"
                    >
                      {savingReply ? 'Approving...' : 'Approve response'}
                    </button>
                  ) : null}
                  <button
                    className="gh-button gh-button-secondary"
                    disabled={savingReply}
                    onClick={startEditingReply}
                    type="button"
                  >
                    Edit response
                  </button>
                </div>
              ) : null}
            </div>

            {replyError ? (
              <p
                className="rounded-md border border-danger-foreground/20 bg-danger-background px-3 py-2 text-sm text-danger-foreground"
                role="alert"
              >
                {replyError}
              </p>
            ) : null}

            {editingReply ? (
              <form className="space-y-4" onSubmit={handleSaveReply}>
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-foreground"
                    htmlFor="response-draft"
                  >
                    Response
                  </label>
                  <textarea
                    aria-describedby="response-draft-count"
                    className="gh-textarea w-full resize-y text-sm"
                    id="response-draft"
                    maxLength={10000}
                    onInput={(event) =>
                      setReplyDraft(event.currentTarget.value)
                    }
                    required
                    value={replyDraft}
                  />
                  <p
                    className="text-right text-xs text-muted"
                    id="response-draft-count"
                  >
                    {replyDraft.length}/10,000
                  </p>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    className="gh-button gh-button-secondary"
                    disabled={savingReply}
                    onClick={() => setEditingReply(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="gh-button gh-button-primary"
                    disabled={savingReply || replyDraft.trim().length === 0}
                    type="submit"
                  >
                    {savingReply ? 'Saving...' : 'Save response'}
                  </button>
                </div>
              </form>
            ) : message.generatedReply ? (
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
