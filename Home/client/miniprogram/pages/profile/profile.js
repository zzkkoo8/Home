const app = getApp()

Page({
  data: {},

  onShow() {
    this.setData({
      userInfo: {
        nickname: app.globalData.nickname,
        avatarUrl: app.globalData.avatarUrl,
        familyName: app.globalData.familyName,
        points: app.globalData.points
      }
    })
  },

  goToPoints() {
    wx.switchTab({ url: '/pages/points/points' })
  },

  goToStore() {
    wx.switchTab({ url: '/pages/store/store' })
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userId = null
          app.globalData.nickname = ''
          app.globalData.avatarUrl = ''
          app.globalData.familyId = null
          app.globalData.familyName = ''
          app.globalData.inviteCode = ''
          app.globalData.points = 0
          wx.removeStorageSync('userId')
          wx.reLaunch({ url: '/pages/login/login' })
        }
      }
    })
  }
})
