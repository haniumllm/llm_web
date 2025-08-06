// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSession } from './entities/chatsession.entity';
import { ChatMessage, ChatMessageDocument } from './schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,

    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  // ✅ MySQL 세션 생성
  async createSession(userId: string, title: string): Promise<ChatSession> {
    const session = this.chatSessionRepository.create({
      user: { userId: Number(userId) } as any, // FK로만 주입
      title,
      isDeleted: false,
    });

    const saved = await this.chatSessionRepository.save(session);
    console.log("✅ 저장된 세션:", saved);
    return saved;
  }

  // ✅ 세션 소유권 확인
  async checkSessionOwnership(sessionId: string, userId: string): Promise<boolean> {
    const session = await this.chatSessionRepository.findOne({
      where: { chatsessionId: Number(sessionId), user: { userId: Number(userId) }, isDeleted: false },
    });
    return !!session;
  }

  // ✅ 세션 목록 조회
  async getUserSessions(userId: number) {
    const sessions = await this.chatSessionRepository.find({
      where: { user: { userId }, isDeleted: false },
      order: { updatedAt: 'DESC' },
    });

    return {
      success: true,
      count: sessions.length,
      sessions: sessions.map((s) => ({
        id: s.chatsessionId,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    };
  }


  // ✅ 메시지 저장 (MongoDB)
  async saveMessage(sessionId: string, message: any) {
    const newMessage = new this.chatMessageModel({
      chatSessionId: Number(sessionId),
      userId: message.userId,
      sender: message.sender,
      text: message.text,
      analysisData: message.analysisData || null,
    });
    return newMessage.save();
  }

  // ✅ 메시지 조회 (MongoDB)
  async getMessagesBySession(sessionId: string, userId: string): Promise<{ history: ChatMessageDocument[] }> {
    const messages = await this.chatMessageModel
      .find({ chatSessionId: Number(sessionId), userId: Number(userId) })
      .sort({ createdAt: 1 })
      .exec();
    return { history: messages };
  }

  // ✅ 세션 활동 시간 갱신
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.chatSessionRepository.update(
      { chatsessionId: Number(sessionId) },
      { updatedAt: new Date() },
    );
  }

  // ✅ 세션 아카이브
  async archiveSession(sessionId: string): Promise<void> {
    await this.chatSessionRepository.update(
      { chatsessionId: Number(sessionId) },
      { isDeleted: true },
    );
  }

  // 관리자 전용
  async getAllSessions(): Promise<any> {
    return await this.chatSessionRepository.find({
      where: { isDeleted: false },
    });
  }

  // 세션 타이틀 수정
  async updateSessionTitle(sessionId: string, userId: string, newTitle: string): Promise<void> {
    const session = await this.chatSessionRepository.findOne({
      where: { chatsessionId: Number(sessionId), user: { userId: Number(userId) }, isDeleted: false },
      relations: ['user'],
    });

    if (!session) {
      throw new Error('세션을 찾을 수 없습니다.');
    }

    session.title = newTitle;
    await this.chatSessionRepository.save(session);
  }

}
