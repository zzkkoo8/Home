import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './modules/user/user.controller';
import { familyRouter } from './modules/family/family.controller';
import { taskRouter } from './modules/task/task.controller';
import { pointsRouter } from './modules/points/points.controller';
import { rewardRouter } from './modules/reward/reward.controller';
import { errorHandler } from './common/middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRouter);
app.use('/api/family', familyRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/points', pointsRouter);
app.use('/api/rewards', rewardRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

createConnection()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
