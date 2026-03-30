const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    rewards: []
  },

  onLoad() {
    this.loadRewards()
  },

  onShow() {
    this.loadRewards()
  },

  loadRewards() {
    request.get('/rewards', { family_id: app.globalData.familyId }).then(res => {
      if (res.code === 0) {
        this.setData({ rewards: res.data })
      }
    })
  },

  handleExchange(e) {
    const reward = e.currentTarget.dataset.reward
    wx.showModal({
      title: '确认兑换',
      content: `确定要用 ${reward.points_price} 积分兑换 "${reward.name}" 吗？`,
      success: (res) => {
        if (res.confirm) {
          request.post(`/rewards/${reward.id}/exchange`).then(res => {
            if (res.code === 0) {
              wx.showToast({ title: '兑换成功', icon: 'success' })
              this.loadRewards()
            }
          }).catch(err => {
            wx.showToast({ title: err.message || '兑换失败', icon: 'none' })
          })
        }
      }
    })
  }
})
