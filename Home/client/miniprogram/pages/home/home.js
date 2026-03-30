const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    tasks: [],
    pendingTasks: [],
    activeTab: 'tasks'
  },

  onLoad() {
    if (!app.globalData.familyId) {
      wx.redirectTo({ url: '/pages/family-create/family-create' })
      return
    }
    this.loadTasks()
  },

  onShow() {
    this.loadTasks()
  },

  onTabChange(e) {
    this.setData({ activeTab: e.detail.key })
  },

  loadTasks() {
    request.get('/tasks', { family_id: app.globalData.familyId }).then(res => {
      if (res.code === 0) {
        this.setData({ tasks: res.data })
      }
    })
  },

  goToTaskCreate() {
    wx.navigateTo({ url: '/pages/task-create/task-create' })
  },

  goToTaskDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/task-detail/task-detail?id=${id}` })
  }
})
