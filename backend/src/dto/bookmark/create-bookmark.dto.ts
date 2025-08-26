// src/dto/bookmark/create-bookmark.dto.ts
import { IsOptional, IsString, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateBookmarkDto {
    @IsString() @IsNotEmpty()
    patentId!: string;

    @IsString() @IsNotEmpty()
    title!: string;

    @IsOptional() @IsString()
    applicantName?: string;

    @IsOptional() @IsString()
    applicationNumber?: string;

    @IsOptional() @IsString()
    applicationDate?: string;

    @IsOptional() @IsString()
    registerStatus?: string;

    @IsOptional() @IsNumberString()
    sessionId?: string;

    @IsOptional() @IsString() @Length(24, 24)
    messageId?: string;
}
