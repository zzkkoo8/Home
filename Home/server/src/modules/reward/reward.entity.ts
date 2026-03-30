import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Family } from '../family/family.entity';
import { Exchange } from './exchange.entity';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  family_id!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'int' })
  points_price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Family, (family) => family.rewards)
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @OneToMany(() => Exchange, (exchange) => exchange.reward)
  exchanges!: Exchange[];
}
