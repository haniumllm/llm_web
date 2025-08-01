import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ required: true }) userId!: number;
  @Prop({ required: true }) sessionId!: string;
  @Prop({ required: true }) message!: string;
  @Prop({ enum: ['user', 'bot'], required: true }) sender!: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
