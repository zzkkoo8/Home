<template>
  <div class="join-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>加入家庭</h2>
    </header>

    <div class="form">
      <van-form @submit="handleJoin">
        <van-cell-group inset>
          <van-field
            v-model="inviteCode"
            name="inviteCode"
            label="邀请码"
            placeholder="请输入8位邀请码"
            maxlength="8"
            :rules="[{ required: true, message: '请输入邀请码' }]"
          />
        </van-cell-group>

        <div class="submit-btn">
          <van-button type="primary" block round native-type="submit" :loading="loading">
            加入家庭
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { familyApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const inviteCode = ref('')

const handleJoin = async () => {
  if (!inviteCode.value.trim()) {
    showToast('请输入邀请码')
    return
  }

  loading.value = true
  try {
    const res: any = await familyApi.join(inviteCode.value)
    userStore.setFamily(res.data)
    showSuccessToast('加入成功')
    router.replace('/home')
  } catch (e: any) {
    showToast(e.message || '加入失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.join-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
}

.back {
  font-size: 20px;
  margin-right: 16px;
  cursor: pointer;
}

.header h2 {
  font-size: 18px;
}

.form {
  margin-top: 20px;
}

.submit-btn {
  margin: 24px 16px;
}
</style>
