import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'username' })
  username!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({
    type: 'enum',
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
    name: 'subscription_type',
  })
  subscriptionType!: 'free' | 'premium' | 'enterprise';

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role!: 'USER' | 'ADMIN';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
