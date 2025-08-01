import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private chatModel: Model<ChatMessage>) {}

  async saveMessage(userId: number, sessionId: string, message: string, sender: 'user' | 'bot') {
    return this.chatModel.create({ userId, sessionId, message, sender });
  }

  async getMessages(userId: number, sessionId: string) {
    return this.chatModel.find({ userId, sessionId }).sort({ createdAt: 1 });
  }
}
