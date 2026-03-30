import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FamilyMember } from '../family/familyMember.entity';
import { Reward } from './reward.entity';

export enum ExchangeStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('exchanges')
export class Exchange {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  member_id!: number;

  @Column({ type: 'bigint' })
  reward_id!: number;

  @Column({ type: 'int' })
  points_spent!: number;

  @Column({
    type: 'enum',
    enum: ExchangeStatus,
    default: ExchangeStatus.PENDING,
  })
  status!: ExchangeStatus;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at!: Date;

  @ManyToOne(() => FamilyMember, (member) => member.exchanges)
  @JoinColumn({ name: 'member_id' })
  member!: FamilyMember;

  @ManyToOne(() => Reward, (reward) => reward.exchanges)
  @JoinColumn({ name: 'reward_id' })
  reward!: Reward;
}
