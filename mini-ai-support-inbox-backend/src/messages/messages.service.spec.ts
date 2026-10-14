import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import { GeminiService } from '../ai/gemini.service.js';
import { Message } from './message.entity.js';
import { MessagesService } from './messages.service.js';

describe('MessagesService', () => {
  let messagesRepository: Repository<Message>;
  let geminiService: GeminiService;
  let messagesService: MessagesService;
  let createMessageRecord: ReturnType<typeof vi.fn>;
  let saveMessageRecord: ReturnType<typeof vi.fn>;
  let findMessageById: ReturnType<typeof vi.fn>;
  let generateMessageContent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createMessageRecord = vi.fn();
    saveMessageRecord = vi.fn();
    findMessageById = vi.fn();
    generateMessageContent = vi.fn();
    messagesRepository = {
      create: createMessageRecord,
      save: saveMessageRecord,
      findOneBy: findMessageById,
    } as unknown as Repository<Message>;
    geminiService = {
      generateMessageContent,
    } as unknown as GeminiService;
    messagesService = new MessagesService(messagesRepository, geminiService);
  });

  it('generates and saves a classified reply for the customer message', async () => {
    const generatedContent = {
      category: 'complaint' as const,
      generatedReply: 'We are sorry about this experience.',
    };
    const savedMessage = {
      id: 1,
      customerMessage: 'The order arrived late.',
      ...generatedContent,
      approved: false,
    } as Message;

    generateMessageContent.mockResolvedValue(generatedContent);
    createMessageRecord.mockReturnValue(savedMessage);
    saveMessageRecord.mockResolvedValue(savedMessage);

    await expect(
      messagesService.create({ customerMessage: '  The order arrived late.  ' }),
    ).resolves.toBe(savedMessage);

    expect(generateMessageContent).toHaveBeenCalledWith(
      'The order arrived late.',
    );
    expect(createMessageRecord).toHaveBeenCalledWith({
      customerMessage: 'The order arrived late.',
      ...generatedContent,
      approved: false,
    });
    expect(saveMessageRecord).toHaveBeenCalledWith(savedMessage);
  });

  it('rejects blank customer messages without calling Gemini', async () => {
    await expect(
      messagesService.create({ customerMessage: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(generateMessageContent).not.toHaveBeenCalled();
    expect(saveMessageRecord).not.toHaveBeenCalled();
  });

  it('does not save the message when AI generation fails', async () => {
    generateMessageContent.mockRejectedValue(new Error('Provider unavailable'));

    await expect(
      messagesService.create({ customerMessage: 'Where is my order?' }),
    ).rejects.toThrow('Provider unavailable');

    expect(saveMessageRecord).not.toHaveBeenCalled();
  });

  it('updates the response draft and resets its approval', async () => {
    const message = {
      id: 1,
      customerMessage: 'Where is my order?',
      category: 'inquiry',
      generatedReply: 'The order is on its way.',
      approved: true,
    } as Message;
    findMessageById.mockResolvedValue(message);
    saveMessageRecord.mockResolvedValue(message);

    await expect(
      messagesService.updateReply(1, {
        generatedReply: '  Your order is on its way.  ',
      }),
    ).resolves.toBe(message);

    expect(message.generatedReply).toBe('Your order is on its way.');
    expect(message.customerMessage).toBe('Where is my order?');
    expect(message.category).toBe('inquiry');
    expect(message.approved).toBe(false);
    expect(saveMessageRecord).toHaveBeenCalledWith(message);
  });

  it('rejects blank response drafts', async () => {
    await expect(
      messagesService.updateReply(1, { generatedReply: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(findMessageById).not.toHaveBeenCalled();
  });

  it('returns not found when editing a missing message', async () => {
    findMessageById.mockResolvedValue(null);

    await expect(
      messagesService.updateReply(42, { generatedReply: 'Updated reply.' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(saveMessageRecord).not.toHaveBeenCalled();
  });

  it('approves and saves a non-empty response', async () => {
    const message = {
      id: 1,
      customerMessage: 'Where is my order?',
      generatedReply: 'Your order is on its way.',
      approved: false,
    } as Message;
    findMessageById.mockResolvedValue(message);
    saveMessageRecord.mockResolvedValue(message);

    await expect(messagesService.approveReply(1)).resolves.toBe(message);

    expect(message.approved).toBe(true);
    expect(saveMessageRecord).toHaveBeenCalledWith(message);
  });

  it('rejects approval when no response draft exists', async () => {
    findMessageById.mockResolvedValue({
      id: 1,
      generatedReply: null,
      approved: false,
    } as Message);

    await expect(messagesService.approveReply(1)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(saveMessageRecord).not.toHaveBeenCalled();
  });

  it('returns not found when approving a missing message', async () => {
    findMessageById.mockResolvedValue(null);

    await expect(messagesService.approveReply(42)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(saveMessageRecord).not.toHaveBeenCalled();
  });
});