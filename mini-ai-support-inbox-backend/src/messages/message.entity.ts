import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import type { MessageCategory } from './message-category.js';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  customerMessage: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  category: MessageCategory | null;

  @Column("text", {
    nullable: true,
  })
  generatedReply: string | null;

  @Column({
    default: false,
  })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}