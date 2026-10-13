import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  customerMessage: string;

  @Column({
    nullable: true,
  })
  category: string;

  @Column("text", {
    nullable: true,
  })
  generatedReply: string;

  @Column({
    default: false,
  })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}