import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../modules/user/user.entity';
import { Family } from '../modules/family/family.entity';
import { FamilyMember } from '../modules/family/familyMember.entity';
import { Task } from '../modules/task/task.entity';
import { PointLog } from '../modules/points/pointLog.entity';
import { Reward } from '../modules/reward/reward.entity';
import { Exchange } from '../modules/reward/exchange.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'family_task_points',
  synchronize: true,
  logging: false,
  entities: [User, Family, FamilyMember, Task, PointLog, Reward, Exchange],
  migrations: [],
  subscribers: [],
});
