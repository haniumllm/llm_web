// src/chat/dto/ui-message.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UiMessageDto {
  @IsIn(['user', 'bot'])
  sender!: 'user' | 'bot';

  @IsString()
  text!: string;

  @IsOptional()
  analysisData?: {
    type: string;
    totalResults?: number;
    riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
    topPatents?: any[];
    recommendedActions?: string[];
    bypassStrategies?: any[];
  };
}
