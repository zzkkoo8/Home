const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    familyName: ''
  },

  onFamilyNameInput(e) {
    this.setData({ familyName: e.detail.value })
  },

  createFamily() {
    if (!this.data.familyName.trim()) {
      wx.showToast({ title: '请输入家庭名称', icon: 'none' })
      return
    }

    request.post('/family/create', { name: this.data.familyName }).then(res => {
      if (res.code === 0) {
        app.globalData.familyId = res.data.id
        app.globalData.familyName = res.data.name
        app.globalData.inviteCode = res.data.invite_code
        wx.showToast({ title: '创建成功', icon: 'success' })
        wx.switchTab({ url: '/pages/home/home' })
      }
    }).catch(err => {
      wx.showToast({ title: '创建失败', icon: 'none' })
    })
  },

  goToJoin() {
    wx.redirectTo({ url: '/pages/family-join/family-join' })
  }
})
