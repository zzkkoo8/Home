const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    inviteCode: ''
  },

  onInviteCodeInput(e) {
    this.setData({ inviteCode: e.detail.value })
  },

  joinFamily() {
    if (!this.data.inviteCode.trim()) {
      wx.showToast({ title: '请输入邀请码', icon: 'none' })
      return
    }

    request.post('/family/join', { invite_code: this.data.inviteCode }).then(res => {
      if (res.code === 0) {
        app.globalData.familyId = res.data.id
        app.globalData.familyName = res.data.name
        app.globalData.inviteCode = res.data.invite_code
        wx.showToast({ title: '加入成功', icon: 'success' })
        wx.switchTab({ url: '/pages/home/home' })
      }
    }).catch(err => {
      wx.showToast({ title: err.message || '加入失败', icon: 'none' })
    })
  },

  goToCreate() {
    wx.redirectTo({ url: '/pages/family-create/family-create' })
  }
})
