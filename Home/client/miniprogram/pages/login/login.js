const app = getApp()
const request = require('../../utils/request')

Page({
  data: {
    demoCode: ''
  },

  onCodeInput(e) {
    this.setData({ demoCode: e.detail.value })
  },

  handleWxLogin() {
    this.login('mock_code_for_demo')
  },

  handleDemoLogin() {
    if (!this.data.demoCode) {
      wx.showToast({ title: '请输入测试码', icon: 'none' })
      return
    }
    this.login(this.data.demoCode)
  },

  login(code) {
    request.post('/auth/login', { code }).then(res => {
      if (res.code === 0) {
        const user = res.data
        app.globalData.userId = user.userId
        app.globalData.nickname = user.nickname
        app.globalData.avatarUrl = user.avatar_url
        wx.setStorageSync('userId', user.userId)
        wx.showToast({ title: '登录成功', icon: 'success' })
        
        if (user.family) {
          app.globalData.familyId = user.family.id
          app.globalData.familyName = user.family.name
          app.globalData.inviteCode = user.family.invite_code
          app.globalData.points = user.points || 0
          wx.switchTab({ url: '/pages/home/home' })
        } else {
          wx.redirectTo({ url: '/pages/family-create/family-create' })
        }
      }
    }).catch(err => {
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  }
})
