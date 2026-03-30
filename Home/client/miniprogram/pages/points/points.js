const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    logs: [],
    ranking: [],
    activeTab: 'logs'
  },

  onLoad() {
    this.loadLogs()
    this.loadRanking()
  },

  onTabChange(e) {
    this.setData({ activeTab: e.target.dataset.key })
  },

  loadLogs() {
    request.get('/points/logs').then(res => {
      if (res.code === 0) {
        this.setData({ logs: res.data })
      }
    })
  },

  loadRanking() {
    request.get('/points/ranking').then(res => {
      if (res.code === 0) {
        this.setData({ ranking: res.data })
      }
    })
  },

  goToPoints() {
    wx.switchTab({ url: '/pages/points/points' })
  }
})
