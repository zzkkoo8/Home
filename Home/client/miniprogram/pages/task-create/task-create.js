const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    title: '',
    description: '',
    points: 0,
    deadline: ''
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value })
  },

  onPointsInput(e) {
    this.setData({ points: parseInt(e.detail.value) || 0 })
  },

  onDateChange(e) {
    this.setData({ deadline: e.detail.value })
  },

  createTask() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入任务名称', icon: 'none' })
      return
    }
    if (this.data.points <= 0) {
      wx.showToast({ title: '积分必须大于0', icon: 'none' })
      return
    }

    const data = {
      family_id: app.globalData.familyId,
      title: this.data.title,
      description: this.data.description,
      points: this.data.points
    }
    if (this.data.deadline) {
      data.deadline = this.data.deadline
    }

    request.post('/tasks', data).then(res => {
      if (res.code === 0) {
        wx.showToast({ title: '创建成功', icon: 'success' })
        wx.navigateBack()
      }
    }).catch(err => {
      wx.showToast({ title: '创建失败', icon: 'none' })
    })
  }
})
