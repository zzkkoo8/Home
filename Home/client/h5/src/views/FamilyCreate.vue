<template>
  <div class="create-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>创建家庭</h2>
    </header>

    <div class="form">
      <van-form @submit="handleCreate">
        <van-cell-group inset>
          <van-field
            v-model="familyName"
            name="familyName"
            label="家庭名称"
            placeholder="请输入家庭名称"
            :rules="[{ required: true, message: '请输入家庭名称' }]"
          />
        </van-cell-group>

        <div class="submit-btn">
          <van-button type="primary" block round native-type="submit" :loading="loading">
            创建家庭
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
const familyName = ref('')

const handleCreate = async () => {
  if (!familyName.value.trim()) {
    showToast('请输入家庭名称')
    return
  }

  loading.value = true
  try {
    const res: any = await familyApi.create(familyName.value)
    userStore.setFamily(res.data)
    showSuccessToast('创建成功')
    router.replace('/home')
  } catch {
    showToast('创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-container {
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
