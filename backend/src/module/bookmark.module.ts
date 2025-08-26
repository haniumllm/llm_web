// src/bookmark/bookmark.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { Bookmark } from '@/entities/bookmark.entity';
import { ChatSession } from '@/entities/chatsession.entity';

import { BookmarkService } from '@/service/bookmark.service';
import { BookmarkController } from '@/controller/bookmark.controller';

import { ChatMessage, ChatMessageSchema } from '@/schemas/chat-message.schema'; // 경로 정확히!

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, ChatSession]),

    // ✅ 여기서 Mongo 모델을 "직접" 제공
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
