import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto.js';
import { MessagesService } from './messages.service.js';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
}