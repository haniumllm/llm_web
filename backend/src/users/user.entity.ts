import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'USER' })
  role!: 'USER' | 'ADMIN';

  @CreateDateColumn()
  createdAt!: Date;
}
