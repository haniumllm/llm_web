// src/bookmark/bookmark.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ChatSession } from '@/entities/chatsession.entity';
import { Bookmark, BookmarkTargetType } from '@/entities/bookmark.entity';
import { ChatMessage, ChatMessageDocument } from '@/schemas/chat-message.schema';
import { CreateBookmarkDto } from '@/dto/bookmark/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  // null 제거 유틸 (DeepPartial 에러 예방)
  private stripNulls<T extends Record<string, any>>(obj: T): Partial<T> {
    const out: Record<string, any> = {};
    Object.keys(obj || {}).forEach((k) => {
      const v = obj[k];
      if (v !== null && v !== undefined) out[k] = v;
    });
    return out as Partial<T>;
  }

  // 'YYYY-MM-DD' 또는 'YYYYMMDD' → Date로 변환
  private normalizeDate(input?: string | null): Date | null | undefined {
    if (!input) return undefined;
    const s = String(input).trim();
    if (!s) return undefined;

    let y: string, m: string, d: string;

    if (/^\d{8}$/.test(s)) {
      y = s.slice(0, 4);
      m = s.slice(4, 6);
      d = s.slice(6, 8);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      [y, m, d] = s.split('-');
    } else {
      return undefined; // 형식 불명 → 저장 생략
    }

    const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
    return isNaN(date.getTime()) ? undefined : date;
  }

  private async assertSessionOwnership(sessionIdNum: number, userIdNum: number): Promise<void> {
    const session = await this.chatSessionRepository.findOne({
      where: { chatsessionId: sessionIdNum, isDeleted: false, user: { userId: userIdNum } },
      relations: ['user'],
    });
    if (!session) throw new ForbiddenException('세션 소유자가 아닙니다.');
  }

  /**
   * 북마크 추가
   * - MESSAGE: dto.sessionId + dto.messageId 필수
   * - PATENT : dto.patentId + title 필수
   */
  async addBookmark(dto: CreateBookmarkDto, userId: number) {
    const userIdNum = Number(userId);

    const isMessageBookmark = !!dto.sessionId && !!dto.messageId;

    let targetType: BookmarkTargetType;
    let targetId: string;
    let title: string;
    let sessionId: number | null | undefined = undefined;

    if (isMessageBookmark) {
      // MESSAGE 북마크
      const sessionIdNum = Number(dto.sessionId);
      await this.assertSessionOwnership(sessionIdNum, userIdNum);

      // Mongo 메시지 존재/소유 확인
      const message = await this.chatMessageModel
        .findOne({
          _id: new Types.ObjectId(dto.messageId!), // 24자 보장
          chatSessionId: sessionIdNum,
          userId: userIdNum,
        })
        .select({ text: 1 })
        .exec();

      if (!message) throw new NotFoundException('메시지를 찾을 수 없습니다.');

      targetType = 'MESSAGE';
      targetId = dto.messageId!;
      title = dto.title || message.text?.slice(0, 100) || '북마크';
      sessionId = sessionIdNum;
    } else {
      // PATENT 북마크
      if (!dto.patentId) {
        throw new BadRequestException('특허 북마크는 patentId가 필요합니다.');
      }
      if (!dto.title) {
        throw new BadRequestException('특허 북마크는 title이 필요합니다.');
      }
      targetType = 'PATENT';
      targetId = dto.patentId;
      title = dto.title;
      sessionId = null; // 특허 북마크는 세션 연결 없음(옵션)
    }

    const entity = this.bookmarkRepository.create(
      this.stripNulls({
        user: { userId: userIdNum } as any, // 관계 주입
        targetType,
        targetId,
        title,

        // 특허 메타는 옵션
        applicantName: dto.applicantName ?? undefined,
        applicationNumber: dto.applicationNumber ?? undefined,
        applicationDate: this.normalizeDate(dto.applicationDate),
        registerStatus: dto.registerStatus ?? undefined,

        // 메시지 북마크일 경우에만 세션 ID 저장
        sessionId: sessionId ?? undefined,
      }),
    );

    try {
      const saved = await this.bookmarkRepository.save(entity);

      // 메시지 북마크일 때만 세션 activity 갱신(옵션)
      if (isMessageBookmark && sessionId) {
        await this.chatSessionRepository.update(
          { chatsessionId: sessionId },
          { updatedAt: new Date() },
        );
      }

      return { success: true, bookmark: saved };
    } catch (e: any) {
      // 유니크 제약(ux_bm_user_target) 위반
      if (e?.code === 'ER_DUP_ENTRY' || e?.errno === 1062) {
        throw new ConflictException('이미 북마크된 항목입니다.');
      }
      throw e;
    }
  }

  // 북마크 삭제 (본인 소유만)
  async removeBookmark(bookmarkId: string | number, userId: number) {
    const idNum = Number(bookmarkId);
    const userIdNum = Number(userId);

    const target = await this.bookmarkRepository.findOne({
      where: { bookmarkId: idNum, user: { userId: userIdNum } }, // 관계 경로로 소유권 확인
      relations: ['user'],
    });

    if (!target) {
      throw new NotFoundException('북마크를 찾을 수 없거나 권한이 없습니다.');
    }

    await this.bookmarkRepository.delete({ bookmarkId: idNum });
    return { success: true };
  }
}
