import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Reward } from './reward.entity';
import { Exchange, ExchangeStatus } from './exchange.entity';
import { FamilyMember } from '../family/familyMember.entity';
import { PointLog, PointType } from '../points/pointLog.entity';
import { AppError, ErrorCodes } from '../../common/utils/errors';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
  const { family_id, name, description, points_price, stock } = req.body;
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { family_id, user_id: userId },
  });

  if (!member || member.role !== 'admin') {
    throw new AppError(403, '只有管理员可以添加奖励');
  }

  const reward = AppDataSource.getRepository(Reward).create({
    family_id,
    name,
    description,
    points_price,
    stock: stock || 0,
  });
  await AppDataSource.getRepository(Reward).save(reward);

  return res.json({
    code: 0,
    data: reward,
  });
});

router.get('/', async (req: Request, res: Response) => {
  const { family_id } = req.query;
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const queryFamilyId = family_id ? parseInt(family_id as string) : member.family_id;

  const rewards = await AppDataSource.getRepository(Reward).find({
    where: { family_id: queryFamilyId },
    order: { created_at: 'DESC' },
  });

  return res.json({
    code: 0,
    data: rewards,
  });
});

router.post('/:id/exchange', async (req: Request, res: Response) => {
  const rewardId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const reward = await AppDataSource.getRepository(Reward).findOne({
    where: { id: rewardId },
  });

  if (!reward) {
    throw new AppError(404, '奖励不存在');
  }

  if (reward.stock <= 0) {
    throw new AppError(
      ErrorCodes.REWARD_STOCK_INSUFFICIENT.code,
      ErrorCodes.REWARD_STOCK_INSUFFICIENT.message
    );
  }

  if (member.points < reward.points_price) {
    throw new AppError(
      ErrorCodes.INSUFFICIENT_POINTS.code,
      ErrorCodes.INSUFFICIENT_POINTS.message
    );
  }

  member.points -= reward.points_price;
  await AppDataSource.getRepository(FamilyMember).save(member);

  const exchange = AppDataSource.getRepository(Exchange).create({
    member_id: member.id,
    reward_id: reward.id,
    points_spent: reward.points_price,
    status: ExchangeStatus.PENDING,
  });
  await AppDataSource.getRepository(Exchange).save(exchange);

  const pointLog = AppDataSource.getRepository(PointLog).create({
    member_id: member.id,
    amount: -reward.points_price,
    type: PointType.SPEND,
    reason: `兑换奖励：${reward.name}`,
  });
  await AppDataSource.getRepository(PointLog).save(pointLog);

  return res.json({
    code: 0,
    data: { exchange_id: exchange.id },
    message: '兑换申请已提交',
  });
});

router.get('/exchanges', async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const exchanges = await AppDataSource.getRepository(Exchange).find({
    where: { member_id: member.id },
    relations: ['reward'],
    order: { created_at: 'DESC' },
  });

  return res.json({
    code: 0,
    data: exchanges.map((e) => ({
      id: e.id,
      reward: { id: e.reward.id, name: e.reward.name, points_price: e.reward.points_price },
      points_spent: e.points_spent,
      status: e.status,
      created_at: e.created_at,
      completed_at: e.completed_at,
    })),
  });
});

router.patch('/:id/complete', async (req: Request, res: Response) => {
  const exchangeId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (!member || member.role !== 'admin') {
    throw new AppError(403, '只有管理员可以确认兑换完成');
  }

  const exchange = await AppDataSource.getRepository(Exchange).findOne({
    where: { id: exchangeId },
    relations: ['reward'],
  });

  if (!exchange) {
    throw new AppError(ErrorCodes.EXCHANGE_NOT_FOUND.code, ErrorCodes.EXCHANGE_NOT_FOUND.message, 404);
  }

  exchange.status = ExchangeStatus.COMPLETED;
  exchange.completed_at = new Date();
  await AppDataSource.getRepository(Exchange).save(exchange);

  const reward = exchange.reward;
  if (reward.stock > 0) {
    reward.stock -= 1;
    await AppDataSource.getRepository(Reward).save(reward);
  }

  return res.json({
    code: 0,
    message: '兑换已完成',
  });
});

export { router as rewardRouter };
