<template>
  <div class="create-task-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>创建任务</h2>
    </header>

    <van-form @submit="handleCreate">
      <van-cell-group inset>
        <van-field
          v-model="form.title"
          name="title"
          label="任务名称"
          placeholder="请输入任务名称"
          :rules="[{ required: true, message: '请输入任务名称' }]"
        />
        <van-field
          v-model="form.description"
          type="textarea"
          name="description"
          label="任务描述"
          placeholder="请输入任务描述（可选）"
          rows="3"
        />
        <van-field
          v-model.number="form.points"
          type="number"
          name="points"
          label="积分奖励"
          placeholder="请输入积分数量"
          :rules="[{ required: true, message: '请输入积分奖励' }]"
        />
        <van-field
          v-model="form.deadline"
          is-link
          readonly
          name="deadline"
          label="截止日期"
          placeholder="请选择截止日期"
          @click="showDatePicker = true"
        />
      </van-cell-group>

      <div class="submit-btn">
        <van-button type="primary" block round native-type="submit" :loading="loading">
          创建任务
        </van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="selectedDate"
        title="选择日期"
        :min-date="minDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { taskApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const showDatePicker = ref(false)
const minDate = new Date()

const form = reactive({
  title: '',
  description: '',
  points: 0,
  deadline: ''
})

const selectedDate = ref(['2024', '01', '01'])

const onDateConfirm = ({ selectedValues }: any) => {
  form.deadline = selectedValues.join('-')
  showDatePicker.value = false
}

const handleCreate = async () => {
  if (!form.title.trim()) {
    showToast('请输入任务名称')
    return
  }
  if (form.points <= 0) {
    showToast('积分必须大于0')
    return
  }

  loading.value = true
  try {
    await taskApi.create({
      family_id: userStore.familyId!,
      title: form.title,
      description: form.description,
      points: form.points,
      deadline: form.deadline || undefined
    })
    showSuccessToast('创建成功')
    router.back()
  } catch {
    showToast('创建失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-task-container {
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

.submit-btn {
  margin: 24px 16px;
}
</style>
