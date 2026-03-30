export class AppError extends Error {
  constructor(
    public code: number,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  USER_NOT_LOGGED_IN: { code: 1001, message: '用户未登录' },
  FAMILY_NOT_FOUND: { code: 2001, message: '家庭不存在' },
  INVALID_INVITE_CODE: { code: 2002, message: '邀请码无效' },
  ALREADY_IN_FAMILY: { code: 2003, message: '已在家庭中' },
  TASK_NOT_FOUND: { code: 3001, message: '任务不存在' },
  TASK_EXPIRED: { code: 3002, message: '任务已过期' },
  INSUFFICIENT_POINTS: { code: 3003, message: '积分不足' },
  REWARD_STOCK_INSUFFICIENT: { code: 4001, message: '奖励库存不足' },
  EXCHANGE_NOT_FOUND: { code: 4002, message: '兑换记录不存在' },
};
