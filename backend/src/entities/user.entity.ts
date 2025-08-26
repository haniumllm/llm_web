// MYSQL user table
import { ChatSession } from '@/entities/chatsession.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@Entity('user')
export class User {
  // 유저 테이블 기본키
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId!: number;

  // 이메일 (중복 불가)
  @Column({ unique: true })
  email!: string;

  // 유저 닉네임 (중복 가능)
  @Column({ name: 'username' })
  username!: string;

  // 비밀번호 (저장될 때 Hash 적용됨)
  @Column({ name: 'password' })
  password!: string;

  // 구독 타입(무료, 프리미엄, 기업 | 기본값 : 무료)
  @Column({
    type: 'enum',
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
    name: 'subscription_type',
  })
  subscriptionType!: 'free' | 'premium' | 'enterprise';

  // 권한 (유저 | 관리자)
  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role!: 'USER' | 'ADMIN';

  // 생성일
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // 채팅 세션
  @OneToMany(() => ChatSession, (session) => session.user)
  chatSession!: ChatSession[];

  // 북마크
  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, { cascade: false })
  bookmarks!: Bookmark[];
}
