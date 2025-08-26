// MYSQL chatsession table
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Bookmark } from './bookmark.entity';

@Entity('chatsession')
export class ChatSession {
    // 채팅세션 테이블 기본키
    @PrimaryGeneratedColumn({ name: 'chatsession_id' })
    chatsessionId!: number;

    // 채팅세션 테이블 유저 외래키
    @ManyToOne(() => User, (user) => user.chatSession, { onDelete: 'CASCADE' }) // 유저 삭제 시 세션 정리
    @JoinColumn({ name: 'user_id' })
    user!: User;

    // 세션 이름 (기본 : 공백)
    @Column({ length: 255, default: '' })
    title!: string;

    // 삭제 여부 (소프트 삭제 체크)
    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    // 생성일
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    // 최근사용일
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => Bookmark, (bookmark) => bookmark.session)
    bookmarks!: Bookmark[];
}
