<template>
  <div class="login-container">
    <div class="logo">
      <h1>家庭任务积分</h1>
      <p>通过完成任务获取积分，兑换奖励</p>
    </div>
    
    <div class="login-btn">
      <button @click="handleWxLogin" :loading="loading">
        微信授权登录
      </button>
    </div>

    <div class="demo-tip">
      <p>演示模式：输入任意内容直接登录</p>
      <input 
        v-model="demoCode" 
        placeholder="输入测试码" 
        @keyup.enter="handleDemoLogin"
      />
      <button @click="handleDemoLogin">演示登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { authApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const demoCode = ref('')

const handleWxLogin = async () => {
  loading.value = true
  try {
    const res: any = await authApi.login('mock_code_for_demo')
    userStore.setUser({
      id: res.data.userId,
      nickname: res.data.nickname || '新用户',
      avatar_url: res.data.avatar_url || '',
      family: null,
      points: 0
    })
    showToast('登录成功')
    checkFamilyAndNavigate()
  } catch {
    showToast('登录失败')
  } finally {
    loading.value = false
  }
}

const handleDemoLogin = async () => {
  if (!demoCode.value.trim()) {
    showToast('请输入测试码')
    return
  }
  loading.value = true
  try {
    const res: any = await authApi.login(demoCode.value)
    userStore.setUser({
      id: res.data.userId,
      nickname: res.data.nickname || '新用户',
      avatar_url: res.data.avatar_url || '',
      family: null,
      points: 0
    })
    showToast('登录成功')
    checkFamilyAndNavigate()
  } catch {
    showToast('登录失败')
  } finally {
    loading.value = false
  }
}

const checkFamilyAndNavigate = () => {
  if (userStore.familyId) {
    router.push('/home')
  } else {
    router.push('/family/create')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo h1 {
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
}

.logo p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.login-btn {
  margin-top: 60px;
}

.login-btn button {
  width: 280px;
  height: 48px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
}

.demo-tip {
  margin-top: 60px;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.demo-tip p {
  font-size: 12px;
  margin-bottom: 12px;
}

.demo-tip input {
  width: 200px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  margin-bottom: 10px;
}

.demo-tip input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.demo-tip button {
  width: 200px;
  height: 36px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
}
</style>
