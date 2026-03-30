import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FamilyMember } from '../family/familyMember.entity';
import { Task } from '../task/task.entity';

export enum PointType {
  EARN = 'earn',
  SPEND = 'spend',
  REFUND = 'refund',
}

@Entity('point_logs')
export class PointLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  member_id!: number;

  @Column({ type: 'bigint', nullable: true })
  task_id!: number;

  @Column({ type: 'int' })
  amount!: number;

  @Column({
    type: 'enum',
    enum: PointType,
  })
  type!: PointType;

  @Column({ type: 'varchar', length: 256, nullable: true })
  reason!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => FamilyMember, (member) => member.pointLogs)
  @JoinColumn({ name: 'member_id' })
  member!: FamilyMember;

  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
}
