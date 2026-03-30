import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../database/data-source';
import { User } from './user.entity';
import { FamilyMember } from '../family/familyMember.entity';
import axios from 'axios';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ code: 400, message: '缺少授权码' });
  }

  const appid = process.env.WECHAT_APPID;
  const secret = process.env.WECHAT_SECRET;

  const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid,
      secret,
      js_code: code,
      grant_type: 'authorization_code',
    },
  });

  const { openid } = response.data;

  let user = await AppDataSource.getRepository(User).findOne({ where: { openid } });

  if (!user) {
    user = AppDataSource.getRepository(User).create({
      openid,
      nickname: `用户${Date.now() % 10000}`,
    });
    await AppDataSource.getRepository(User).save(user);
  }

  return res.json({
    code: 0,
    data: {
      userId: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
    },
  });
});

router.get('/profile', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ code: 1001, message: '用户未登录' });
  }

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: parseInt(userId as string) },
  });

  if (!user) {
    return res.status(404).json({ code: 404, message: '用户不存在' });
  }

  const member = await AppDataSource.getRepository(FamilyMember).findOne({
    where: { user_id: user.id },
    relations: ['family'],
  });

  return res.json({
    code: 0,
    data: {
      id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      family: member?.family || null,
      points: member?.points || 0,
    },
  });
});

export { router as userRouter };
