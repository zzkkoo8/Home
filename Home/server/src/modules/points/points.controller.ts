import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { FamilyMember } from '../family/familyMember.entity';
import { PointLog } from './pointLog.entity';
import { AppError, ErrorCodes } from '../../common/utils/errors';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/balance', async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  return res.json({
    code: 0,
    data: {
      points: member.points,
      member_id: member.id,
    },
  });
});

router.get('/logs', async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const logs = await AppDataSource.getRepository(PointLog).find({
    where: { member_id: member.id },
    relations: ['task'],
    order: { created_at: 'DESC' },
    take: 50,
  });

  return res.json({
    code: 0,
    data: logs.map((log) => ({
      id: log.id,
      amount: log.amount,
      type: log.type,
      reason: log.reason,
      task: log.task ? { id: log.task.id, title: log.task.title } : null,
      created_at: log.created_at,
    })),
  });
});

router.get('/ranking', async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const members = await AppDataSource.getRepository(FamilyMember).find({
    where: { family_id: member.family_id },
    relations: ['user'],
    order: { points: 'DESC' },
  });

  return res.json({
    code: 0,
    data: members.map((m, index) => ({
      rank: index + 1,
      user_id: m.user_id,
      nickname: m.user.nickname,
      avatar_url: m.user.avatar_url,
      points: m.points,
    })),
  });
});

export { router as pointsRouter };
