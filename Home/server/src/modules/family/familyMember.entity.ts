import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Family } from './family.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { PointLog } from '../points/pointLog.entity';
import { Exchange } from '../reward/exchange.entity';

export enum MemberRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  family_id!: number;

  @Column({ type: 'bigint' })
  user_id!: number;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role!: MemberRole;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @CreateDateColumn()
  joined_at!: Date;

  @ManyToOne(() => Family, (family) => family.members)
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @ManyToOne(() => User, (user) => user.familyMembers)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Task, (task) => task.executor)
  tasks!: Task[];

  @OneToMany(() => PointLog, (log) => log.member)
  pointLogs!: PointLog[];

  @OneToMany(() => Exchange, (exchange) => exchange.member)
  exchanges!: Exchange[];
}
