// src/chat/schemas/chat-message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'chat_messages', timestamps: true })
export class ChatMessage {
  @Prop({ required: true })
  chatSessionId!: number;

  @Prop({ required: true })
  userId!: number;

  @Prop({ required: true })
  sender!: 'user' | 'bot';

  @Prop({ required: true })
  text!: string;

  @Prop({ type: Object, default: null })
  analysisData?: Record<string, any>;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
