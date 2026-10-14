import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto.js';
import { MessagesService } from './messages.service.js';
import { UpdateMessageReplyDto } from './update-message-reply.dto.js';

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

  @Patch(':id/approve')
  approveReply(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.approveReply(id);
  }

  @Patch(':id')
  updateReply(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageReplyDto: UpdateMessageReplyDto,
  ) {
    return this.messagesService.updateReply(id, updateMessageReplyDto);
  }
}