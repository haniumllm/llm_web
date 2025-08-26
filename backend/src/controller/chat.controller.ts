import {
  Controller,
  Post,
  Param,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { UiMessageDto } from '../dto/chat/ui-message.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/jwt/jwt-auth.guard';
import { UpdateSessionDto } from '../dto/chat/update-session.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ✅ 세션 생성
  @Post('session')
  async createSession(
    @Req() req: Request,
    @Body() body?: { title?: string }
  ) {
    try {
      const userId = (req.user as { userId: string }).userId;
      const title = body?.title || '새 대화';

      const session = await this.chatService.createSession(userId, title);

      console.log('새 세션 생성:', { sessionId: session.chatsessionId, userId, title });

      return {
        sessionId: session.chatsessionId.toString(),
        title: session.title,
        createdAt: session.createdAt,
      };
    } catch (error) {
      console.error('세션 생성 실패:', error);
      throw new HttpException('세션 생성에 실패했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ 메시지 저장
  @Post(':sessionId')
  async saveMessage(
    @Param('sessionId') sessionId: string,
    @Body() message: UiMessageDto,
    @Req() req: Request
  ) {
    try {
      const userId = (req.user as { userId: string }).userId;

      const isOwner = await this.chatService.checkSessionOwnership(sessionId, userId);
      if (!isOwner) {
        throw new HttpException('접근 권한이 없습니다', HttpStatus.FORBIDDEN);
      }

      console.log('메시지 저장 요청:', { sessionId, userId, sender: message.sender });

      const messageWithUserId = { ...message, userId };
      const result = await this.chatService.saveMessage(sessionId, messageWithUserId);

      await this.chatService.updateSessionActivity(sessionId);

      console.log('메시지 저장 완료:', result._id);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('메시지 저장 실패:', error);
      throw new HttpException('메시지 저장에 실패했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ 세션 메시지 조회
  @Get(':sessionId')
  async getSessionMessages(
    @Param('sessionId') sessionId: string,
    @Req() req: Request,
    @Query('userId') queryUserId?: string
  ) {
    try {
      const userId = (req.user as { userId: string }).userId;

      const isOwner = await this.chatService.checkSessionOwnership(sessionId, userId);
      if (!isOwner) {
        throw new HttpException('접근 권한이 없습니다', HttpStatus.FORBIDDEN);
      }

      console.log('세션 메시지 조회 요청:', { sessionId, userId });

      const result = await this.chatService.getMessagesBySession(sessionId, userId);

      console.log('조회 결과:', {
        sessionId,
        messageCount: result.history?.length || 0,
        userId,
      });

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('메시지 조회 실패:', error);
      throw new HttpException('메시지 조회에 실패했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ 세션 목록 조회
  @Get('sessions/list')
  async getUserSessions(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    return this.chatService.getUserSessions(Number(userId));
  }

  // ✅ 세션 삭제
  @Post(':sessionId/archive')
  async archiveSession(
    @Param('sessionId') sessionId: string,
    @Req() req: Request
  ) {
    try {
      const userId = (req.user as { userId: string }).userId;

      const isOwner = await this.chatService.checkSessionOwnership(sessionId, userId);
      if (!isOwner) {
        throw new HttpException('접근 권한이 없습니다', HttpStatus.FORBIDDEN);
      }

      await this.chatService.archiveSession(sessionId);

      return { success: true, message: '세션이 아카이브되었습니다' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('세션 아카이브에 실패했습니다', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('sessions/:sessionId')
  async updateSessionTitle(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
    @Req() req: Request
  ) {
    try {
      const userId = (req.user as any).userId;
      await this.chatService.updateSessionTitle(sessionId, userId, dto.title);
      return { success: true, message: '세션 제목이 업데이트되었습니다.' };
    } catch (error) {
      console.error('세션 제목 업데이트 실패:', error);
      throw new HttpException('세션 제목 업데이트에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
