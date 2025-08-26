// src/chat/dto/update-session.dto.ts
import { IsString, Length } from 'class-validator';

export class UpdateSessionDto {
  @IsString()
  @Length(1, 255)
  title!: string;
}
