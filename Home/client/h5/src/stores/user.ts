import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  nickname: string
  avatar_url: string
  family: {
    id: number
    name: string
    invite_code: string
  } | null
  points: number
}

export const useUserStore = defineStore('user', () => {
  const userId = ref<number | null>(null)
  const nickname = ref('')
  const avatarUrl = ref('')
  const familyId = ref<number | null>(null)
  const familyName = ref('')
  const inviteCode = ref('')
  const points = ref(0)

  const setUser = (user: User) => {
    userId.value = user.id
    nickname.value = user.nickname
    avatarUrl.value = user.avatar_url
    familyId.value = user.family?.id || null
    familyName.value = user.family?.name || ''
    inviteCode.value = user.family?.invite_code || ''
    points.value = user.points
    
    if (user.id) {
      localStorage.setItem('userId', String(user.id))
    }
  }

  const setFamily = (family: { id: number; name: string; invite_code: string }) => {
    familyId.value = family.id
    familyName.value = family.name
    inviteCode.value = family.invite_code
  }

  const setPoints = (newPoints: number) => {
    points.value = newPoints
  }

  const logout = () => {
    userId.value = null
    nickname.value = ''
    avatarUrl.value = ''
    familyId.value = null
    familyName.value = ''
    inviteCode.value = ''
    points.value = 0
    localStorage.removeItem('userId')
  }

  const initFromStorage = () => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      userId.value = parseInt(storedUserId)
    }
  }

  return {
    userId,
    nickname,
    avatarUrl,
    familyId,
    familyName,
    inviteCode,
    points,
    setUser,
    setFamily,
    setPoints,
    logout,
    initFromStorage
  }
})
