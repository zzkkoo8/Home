import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Family } from './family.entity';
import { FamilyMember, MemberRole } from './familyMember.entity';
import { User } from '../user/user.entity';
import { AppError, ErrorCodes } from '../../common/utils/errors';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/create', async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = (req as any).userId;

  if (!name) {
    throw new AppError(400, '家庭名称不能为空');
  }

  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const family = AppDataSource.getRepository(Family).create({
    name,
    invite_code: inviteCode,
    created_by: userId,
  });
  await AppDataSource.getRepository(Family).save(family);

  const member = AppDataSource.getRepository(FamilyMember).create({
    family_id: family.id,
    user_id: userId,
    role: MemberRole.ADMIN,
    points: 0,
  });
  await AppDataSource.getRepository(FamilyMember).save(member);

  return res.json({
    code: 0,
    data: {
      id: family.id,
      name: family.name,
      invite_code: family.invite_code,
    },
  });
});

router.post('/join', async (req: Request, res: Response) => {
  const { invite_code } = req.body;
  const userId = (req as any).userId;

  if (!invite_code) {
    throw new AppError(400, '邀请码不能为空');
  }

  const existingMember = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: userId },
  });

  if (existingMember) {
    throw new AppError(
      ErrorCodes.ALREADY_IN_FAMILY.code,
      ErrorCodes.ALREADY_IN_FAMILY.message
    );
  }

  const family = await AppDataSource.getRepository(Family).findOne({
    where: { invite_code },
  });

  if (!family) {
    throw new AppError(
      ErrorCodes.INVALID_INVITE_CODE.code,
      ErrorCodes.INVALID_INVITE_CODE.message
    );
  }

  const member = AppDataSource.getRepository(FamilyMember).create({
    family_id: family.id,
    user_id: userId,
    role: MemberRole.MEMBER,
    points: 0,
  });
  await AppDataSource.getRepository(FamilyMember).save(member);

  return res.json({
    code: 0,
    data: {
      id: family.id,
      name: family.name,
      invite_code: family.invite_code,
    },
  });
});

router.get('/:id', async (req: Request, res: Response) => {
  const familyId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { family_id: familyId, user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const family = await AppDataSource.getRepository(Family).findOne({
    where: { id: familyId },
  });

  return res.json({
    code: 0,
    data: family,
  });
});

router.get('/:id/members', async (req: Request, res: Response) => {
  const familyId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { family_id: familyId, user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  const members = await AppDataSource.getRepository(FamilyMember).find({
    where: { family_id: familyId },
    relations: ['user'],
    order: { points: 'DESC' },
  });

  const data = members.map((m) => ({
    id: m.id,
    user_id: m.user_id,
    nickname: m.user.nickname,
    avatar_url: m.user.avatar_url,
    role: m.role,
    points: m.points,
    joined_at: m.joined_at,
  }));

  return res.json({
    code: 0,
    data,
  });
});

router.delete('/:id/leave', async (req: Request, res: Response) => {
  const familyId = parseInt(req.params.id);
  const userId = (req as any).userId;

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { family_id: familyId, user_id: userId },
  });

  if (!member) {
    throw new AppError(ErrorCodes.FAMILY_NOT_FOUND.code, ErrorCodes.FAMILY_NOT_FOUND.message, 404);
  }

  member.points = 0;
  await AppDataSource.getRepository(FamilyMember).save(member);
  await AppDataSource.getRepository(FamilyMember).remove(member);

  return res.json({
    code: 0,
    message: '已离开家庭',
  });
});

export { router as familyRouter };
