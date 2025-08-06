import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty() _id!: string;
  @ApiProperty({ enum: ['user', 'bot'] })
  sender!: 'user' | 'bot';
  @ApiProperty() message!: string;
  @ApiProperty() createdAt!: string;
}

export class ChatHistoryResponseDto {
  @ApiProperty({ type: [ChatMessageDto] })
  history!: ChatMessageDto[];
}
