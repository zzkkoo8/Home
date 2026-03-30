import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FamilyMember } from './familyMember.entity';
import { Task } from '../task/task.entity';
import { Reward } from '../reward/reward.entity';

@Entity('families')
export class Family {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @Column({ type: 'varchar', length: 8, unique: true })
  invite_code!: string;

  @Column({ type: 'bigint' })
  created_by!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => FamilyMember, (member) => member.family)
  members!: FamilyMember[];

  @OneToMany(() => Task, (task) => task.family)
  tasks!: Task[];

  @OneToMany(() => Reward, (reward) => reward.family)
  rewards!: Reward[];
}
