import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from '../ai/gemini.service.js';
import { CreateMessageDto } from './create-message.dto.js';
import { Message } from './message.entity.js';
import { UpdateMessageReplyDto } from './update-message-reply.dto.js';

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

  async updateReply(
    id: number,
    updateMessageReplyDto: UpdateMessageReplyDto,
  ): Promise<Message> {
    const generatedReply = updateMessageReplyDto.generatedReply?.trim();
    if (!generatedReply) {
      throw new BadRequestException('Response must not be empty.');
    }
    if (generatedReply.length > 10000) {
      throw new BadRequestException(
        'Response must be 10,000 characters or fewer.',
      );
    }

    const message = await this.messagesRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException(`Message ${id} was not found.`);
    }

    message.generatedReply = generatedReply;
    return this.messagesRepository.save(message);
  }
}