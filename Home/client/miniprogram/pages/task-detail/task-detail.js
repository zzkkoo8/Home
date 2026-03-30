const request = require('../../utils/request')
const app = getApp()

Page({
  data: {
    task: null,
    statusMap: {
      pending: '待执行',
      applying: '待审核',
      approved: '已完成',
      rejected: '已拒绝',
      expired: '已过期'
    }
  },

  onLoad(options) {
    this.loadTask(options.id)
  },

  loadTask(id) {
    request.get(`/tasks/${id}`).then(res => {
      if (res.code === 0) {
        this.setData({ task: res.data })
      }
    }).catch(err => {
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  handleApply() {
    request.post(`/tasks/${this.data.task.id}/apply`).then(res => {
      if (res.code === 0) {
        wx.showToast({ title: '已提交申请', icon: 'success' })
        this.loadTask(this.data.task.id)
      }
    }).catch(err => {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    })
  },

  handleApprove() {
    request.post(`/tasks/${this.data.task.id}/approve`).then(res => {
      if (res.code === 0) {
        wx.showToast({ title: '审核通过', icon: 'success' })
        this.loadTask(this.data.task.id)
      }
    }).catch(err => {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  handleReject() {
    request.post(`/tasks/${this.data.task.id}/reject`).then(res => {
      if (res.code === 0) {
        wx.showToast({ title: '已拒绝', icon: 'success' })
        this.loadTask(this.data.task.id)
      }
    }).catch(err => {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  }
})
