import api from './request'

export const authApi = {
  login: (code: string) => api.post('/auth/login', { code }),
  getProfile: () => api.get('/auth/profile')
}

export const familyApi = {
  create: (name: string) => api.post('/family/create', { name }),
  join: (inviteCode: string) => api.post('/family/join', { invite_code: inviteCode }),
  getInfo: (id: number) => api.get(`/family/${id}`),
  getMembers: (id: number) => api.get(`/family/${id}/members`),
  leave: (id: number) => api.delete(`/family/${id}/leave`)
}

export const taskApi = {
  create: (data: {
    family_id: number
    title: string
    description?: string
    points: number
    deadline?: string
    executor_id?: number
  }) => api.post('/tasks', data),
  list: (familyId?: number, status?: string) => {
    const params: any = {}
    if (familyId) params.family_id = familyId
    if (status) params.status = status
    return api.get('/tasks', { params })
  },
  detail: (id: number) => api.get(`/tasks/${id}`),
  apply: (id: number) => api.post(`/tasks/${id}/apply`),
  approve: (id: number) => api.post(`/tasks/${id}/approve`),
  reject: (id: number, reason?: string) => api.post(`/tasks/${id}/reject`, { reason })
}

export const pointsApi = {
  balance: () => api.get('/points/balance'),
  logs: () => api.get('/points/logs'),
  ranking: () => api.get('/points/ranking')
}

export const rewardApi = {
  create: (data: {
    family_id: number
    name: string
    description?: string
    points_price: number
    stock?: number
  }) => api.post('/rewards', data),
  list: (familyId?: number) => {
    const params: any = {}
    if (familyId) params.family_id = familyId
    return api.get('/rewards', { params })
  },
  exchange: (id: number) => api.post(`/rewards/${id}/exchange`),
  exchanges: () => api.get('/rewards/exchanges'),
  complete: (id: number) => api.patch(`/rewards/${id}/complete`)
}
