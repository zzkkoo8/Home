const app = getApp()

const request = {
  baseUrl: app.globalData.baseUrl,

  async request(method, path, data = {}) {
    const header = {
      'Content-Type': 'application/json'
    }

    const userId = wx.getStorageSync('userId')
    if (userId) {
      header['x-user-id'] = userId
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}${path}`,
        method,
        data,
        header,
        success: (res) => {
          const data = res.data
          if (data.code !== 0) {
            wx.showToast({ title: data.message || '请求失败', icon: 'none' })
            reject(new Error(data.message))
          } else {
            resolve(data)
          }
        },
        fail: (err) => {
          wx.showToast({ title: '网络错误', icon: 'none' })
          reject(err)
        }
      })
    })
  },

  get(path, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
    const url = queryString ? `${path}?${queryString}` : path
    return this.request('GET', url)
  },

  post(path, data) {
    return this.request('POST', path, data)
  },

  patch(path, data) {
    return this.request('PATCH', path, data)
  },

  delete(path) {
    return this.request('DELETE', path)
  }
}

module.exports = request
