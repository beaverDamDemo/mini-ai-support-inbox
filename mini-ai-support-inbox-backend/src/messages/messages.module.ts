import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiModule } from '../ai/gemini.module.js';
import { Message } from './message.entity.js';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), GeminiModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule { }