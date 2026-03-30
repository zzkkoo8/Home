App({
  globalData: {
    userId: null,
    nickname: '',
    avatarUrl: '',
    familyId: null,
    familyName: '',
    inviteCode: '',
    points: 0,
    baseUrl: 'http://localhost:3000/api'
  },

  onLaunch() {
    const userId = wx.getStorageSync('userId')
    if (userId) {
      this.globalData.userId = userId
    }
  }
})
