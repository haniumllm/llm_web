// src/entities/bookmark.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChatSession } from './chatsession.entity';

/**
 * 북마크 대상 구분 타입
 * - PATENT  : 특허 북마크
 * - MESSAGE : 채팅 메시지 북마크
 */
export type BookmarkTargetType = 'PATENT' | 'MESSAGE';

@Entity('bookmark')
@Index('idx_bm_user_created', ['userId', 'createdAt']) // 사용자별 생성일 정렬/검색 인덱스
@Index('ux_bm_user_target', ['userId', 'targetType', 'targetId'], { unique: true }) // 사용자+타입+타겟ID 유니크
export class Bookmark {
  /**
   * 북마크 고유 식별자 (자동 증가 PK)
   * - DB 컬럼명: bookmark_id
   */
  @PrimaryGeneratedColumn({ name: 'bookmark_id' })
  bookmarkId!: number;

  /**
   * 북마크를 생성한 사용자 ID
   * - DB 컬럼명: user_id
   */
  @ManyToOne(() => User, (user) => user.bookmarks, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * 북마크 대상 타입
   * - 'PATENT'  : 특허 북마크
   * - 'MESSAGE' : 채팅 메시지 북마크
   * - DB 컬럼명: target_type
   */
  @Column({ name: 'target_type', type: 'enum', enum: ['PATENT', 'MESSAGE'] })
  targetType!: BookmarkTargetType;

  /**
   * 북마크 대상의 고유 ID
   * - targetType='PATENT'  → 특허 ID (예: KIPRIS patentId)
   * - targetType='MESSAGE' → Mongo ObjectId (24자)
   * - 최대 길이: 64
   * - DB 컬럼명: target_id
   */
  @Column({ name: 'target_id', type: 'varchar', length: 64 })
  targetId!: string;

  /**
   * 북마크 제목
   * - 특허일 경우: 발명의 명칭
   * - 메시지일 경우: 메시지 요약 또는 대화 내용 일부
   */
  @Column({ length: 512 })
  title!: string;

  /**
   * 출원인명 (특허 북마크 시 메타 데이터)
   * - nullable
   * - DB 컬럼명: applicant_name
   */
  @Column({ name: 'applicant_name', length: 255, nullable: true })
  applicantName?: string | null;

  /**
   * 출원번호 (특허 북마크 시 메타 데이터)
   * - nullable
   * - DB 컬럼명: application_number
   */
  @Column({ name: 'application_number', length: 64, nullable: true })
  applicationNumber?: string | null;

  /**
   * 출원일 (YYYY-MM-DD)
   * - nullable
   * - DB 컬럼명: application_date
   */
  @Column({ name: 'application_date', type: 'date', nullable: true })
  applicationDate?: Date | null;

  /**
   * 등록 상태
   * - 예: '등록', '공개', '거절'
   * - nullable
   * - DB 컬럼명: register_status
   */
  @Column({ name: 'register_status', length: 64, nullable: true })
  registerStatus?: string | null;

  /**
   * 세션 ID (메시지 북마크 시 해당 채팅 세션 번호)
   * - nullable
   * - DB 컬럼명: session_id
   */
  @ManyToOne(() => ChatSession, (session) => session.bookmarks, {
  nullable: true,
  onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'session_id' })
    session?: ChatSession | null;

  /**
   * 북마크 생성일
   * - 자동 생성
   * - DB 컬럼명: created_at
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
