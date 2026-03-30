import axios from 'axios'
import { showToast } from 'vant'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      config.headers['x-user-id'] = userId
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      showToast(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    showToast(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default api
