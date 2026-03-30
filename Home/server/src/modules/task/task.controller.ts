import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Task, TaskStatus } from './task.entity';
import { FamilyMember } from '../family/familyMember.entity';
import { PointLog, PointType } from '../points/pointLog.entity';
import { AppError, ErrorCodes } from '../../common/utils/errors';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
  const { family_id, title, description, points, deadline, executor_id } = req.body;
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { family_id, user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const task = AppDataSource.getRepository(Task).create({
    family_id,
    creator_id: member.id,
    executor_id: executor_id || null,
    title,
    description,
    points,
    deadline: deadline ? new Date(deadline) : null,
    status: TaskStatus.PENDING,
  });
  await AppDataSource.getRepository(Task).save(task);

  return res.json({
    code: 0,
    data: task,
  });
});

router.get('/', async (req: Request, res: Response) => {
  const { family_id, status } = req.query;
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const queryFamilyId = family_id ? parseInt(family_id as string) : member.family_id;

  const where: any = { family_id: queryFamilyId };
  if (status) {
    where.status = status;
  }

  const tasks = await AppDataSource.getRepository(Task).find({
    where,
    relations: ['creator', 'executor'],
    order: { created_at: 'DESC' },
  });

  return res.json({
    code: 0,
    data: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      points: t.points,
      status: t.status,
      deadline: t.deadline,
      creator: { id: t.creator.id, nickname: t.creator.user?.nickname },
      executor: t.executor ? { id: t.executor.id, nickname: t.executor.user?.nickname } : null,
      created_at: t.created_at,
      completed_at: t.completed_at,
    })),
  });
});

router.get('/:id', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);

  const task = await AppDataSource.getRepository(Task).findOne({
    where: { id: taskId },
    relations: ['creator', 'executor', 'family'],
  });

  if (!task) {
    throw new AppError(ErrorCodes.TASK_NOT_FOUND.code, ErrorCodes.TASK_NOT_FOUND.message, 404);
  }

  return res.json({
    code: 0,
    data: {
      id: task.id,
      title: task.title,
      description: task.description,
      points: task.points,
      status: task.status,
      deadline: task.deadline,
      family: { id: task.family.id, name: task.family.name },
      creator: { id: task.creator.id, nickname: task.creator.user?.nickname },
      executor: task.executor ? { id: task.executor.id, nickname: task.executor.user?.nickname } : null,
      created_at: task.created_at,
      completed_at: task.completed_at,
    },
  });
});

router.post('/:id/apply', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const task = await AppDataSource.getRepository(Task).findOne({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(ErrorCodes.TASK_NOT_FOUND.code, ErrorCodes.TASK_NOT_FOUND.message, 404);
  }

  if (task.deadline && new Date() > task.deadline) {
    task.status = TaskStatus.EXPIRED;
    await AppDataSource.getRepository(Task).save(task);
    throw new AppError(ErrorCodes.TASK_EXPIRED.code, ErrorCodes.TASK_EXPIRED.message);
  }

  task.status = TaskStatus.APPLYING;
  task.executor_id = member.id;
  task.completed_at = new Date();
  await AppDataSource.getRepository(Task).save(task);

  return res.json({
    code: 0,
    message: '申请已提交，等待审核',
  });
});

router.post('/:id/approve', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const task = await AppDataSource.getRepository(Task).findOne({
    where: { id: taskId },
    relations: ['executor'],
  });

  if (!task) {
    throw new AppError(ErrorCodes.TASK_NOT_FOUND.code, ErrorCodes.TASK_NOT_FOUND.message, 404);
  }

  task.status = TaskStatus.APPROVED;
  await AppDataSource.getRepository(Task).save(task);

  const executor = task.executor;
  executor.points += task.points;
  await AppDataSource.getRepository(FamilyMember).save(executor);

  const pointLog = AppDataSource.getRepository(PointLog).create({
    member_id: executor.id,
    task_id: task.id,
    amount: task.points,
    type: PointType.EARN,
    reason: `完成任务：${task.title}`,
  });
  await AppDataSource.getRepository(PointLog).save(pointLog);

  return res.json({
    code: 0,
    message: '审核通过，积分已发放',
  });
});

router.post('/:id/reject', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const { reason } = req.body;
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const task = await AppDataSource.getRepository(Task).findOne({
    where: { id: taskId },
    relations: ['executor'],
  });

  if (!task) {
    throw new AppError(ErrorCodes.TASK_NOT_FOUND.code, ErrorCodes.TASK_NOT_FOUND.message, 404);
  }

  task.status = TaskStatus.REJECTED;
  task.executor_id = null;
  task.completed_at = null;
  await AppDataSource.getRepository(Task).save(task);

  if (task.executor) {
    const pointLog = AppDataSource.getRepository(PointLog).create({
      member_id: task.executor.id,
      task_id: task.id,
      amount: -task.points,
      type: PointType.REFUND,
      reason: reason || `任务被拒绝：${task.title}`,
    });
    await AppDataSource.getRepository(PointLog).save(pointLog);
  }

  return res.json({
    code: 0,
    message: '已拒绝申请',
  });
});

export { router as taskRouter };
