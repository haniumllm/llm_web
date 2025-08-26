// MONGODB chat_messages 스키마
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'chat_messages', timestamps: true })
export class ChatMessage {
  // 채팅세션 ID
  @Prop({ required: true, index: true })
  chatSessionId!: number;

  // 유저 ID
  @Prop({ required: true, index: true })
  userId!: number;

  // 보낸
  @Prop({ required: true, enum: ['user', 'bot'], index: true })
  sender!: 'user' | 'bot';

  @Prop({ required: true })
  text!: string;

  @Prop({ type: Object, default: null })
  analysisData?: {
    type?: 'DUP_FOUND' | 'STRATEGY_GEN' | 'SEARCH_SUMMARY' | string;
    [key: string]: any;
  };

  @Prop() createdAt?: Date;
  @Prop() updatedAt?: Date;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

ChatMessageSchema.index({ userId: 1, chatSessionId: 1, createdAt: -1});
ChatMessageSchema.index({ userId: 1, 'analysisData.type': 1, createdAt: -1});
ChatMessageSchema.index({ createdAt: -1});