import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Family } from '../family/family.entity';
import { FamilyMember } from '../family/familyMember.entity';

export enum TaskStatus {
  PENDING = 'pending',
  APPLYING = 'applying',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  family_id!: number;

  @Column({ type: 'bigint' })
  creator_id!: number;

  @Column({ type: 'bigint', nullable: true })
  executor_id!: number;

  @Column({ type: 'varchar', length: 128 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int' })
  points!: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Column({ type: 'datetime', nullable: true })
  deadline!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at!: Date;

  @ManyToOne(() => Family, (family) => family.tasks)
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @ManyToOne(() => FamilyMember)
  @JoinColumn({ name: 'creator_id' })
  creator!: FamilyMember;

  @ManyToOne(() => FamilyMember, (member) => member.tasks)
  @JoinColumn({ name: 'executor_id' })
  executor!: FamilyMember;
}
