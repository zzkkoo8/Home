import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FamilyMember } from '../family/familyMember.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  openid!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  nickname!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  avatar_url!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => FamilyMember, (member) => member.user)
  familyMembers!: FamilyMember[];
}
