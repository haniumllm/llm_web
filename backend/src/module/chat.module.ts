// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from '../service/chat.service';
import { ChatController } from '../controller/chat.controller';
import { ChatMessage, ChatMessageSchema } from '../schemas/chat-message.schema';
import { ChatSession } from '../entities/chatsession.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
    TypeOrmModule.forFeature([ChatSession]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
