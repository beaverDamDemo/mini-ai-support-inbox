import { apiRequest } from '@/lib/api-client';
import type { CreateMessageInput, Message } from './types';

export function getMessages(): Promise<Message[]> {
  return apiRequest<Message[]>('/messages');
}

export async function getMessage(messageId: string): Promise<Message | null> {
  const messages = await getMessages();
  return messages.find((message) => message.id === Number(messageId)) ?? null;
}

export function createMessage(input: CreateMessageInput): Promise<Message> {
  return apiRequest<Message>('/messages', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateMessageReply(
  messageId: string,
  generatedReply: string,
): Promise<Message> {
  return apiRequest<Message>(`/messages/${messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ generatedReply }),
  });
}

export function approveMessageReply(messageId: string): Promise<Message> {
  return apiRequest<Message>(`/messages/${messageId}/approve`, {
    method: 'PATCH',
  });
}