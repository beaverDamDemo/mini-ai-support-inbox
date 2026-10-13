import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from '../ai/gemini.service.js';
import { CreateMessageDto } from './create-message.dto.js';
import { Message } from './message.entity.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly geminiService: GeminiService,
  ) { }

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const customerMessage = createMessageDto.customerMessage?.trim();
    if (!customerMessage) {
      throw new BadRequestException('Customer message must not be empty.');
    }
    if (customerMessage.length > 10000) {
      throw new BadRequestException(
        'Customer message must be 10,000 characters or fewer.',
      );
    }

    const generatedContent =
      await this.geminiService.generateMessageContent(customerMessage);
    const message = this.messagesRepository.create({
      customerMessage,
      ...generatedContent,
      approved: false,
    });
    return this.messagesRepository.save(message);
  }
}