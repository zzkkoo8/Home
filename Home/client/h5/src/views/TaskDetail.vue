<template>
  <div class="task-detail-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>任务详情</h2>
    </header>

    <div class="content" v-if="task">
      <div class="task-card">
        <h1>{{ task.title }}</h1>
        <p v-if="task.description" class="description">{{ task.description }}</p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="label">积分奖励</span>
            <span class="value points">+{{ task.points }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态</span>
            <span class="value status" :class="task.status">{{ getStatusText(task.status) }}</span>
          </div>
          <div class="info-item">
            <span class="label">创建者</span>
            <span class="value">{{ task.creator?.nickname }}</span>
          </div>
          <div class="info-item" v-if="task.executor">
            <span class="label">执行者</span>
            <span class="value">{{ task.executor?.nickname }}</span>
          </div>
          <div class="info-item" v-if="task.deadline">
            <span class="label">截止日期</span>
            <span class="value">{{ formatDate(task.deadline) }}</span>
          </div>
          <div class="info-item" v-if="task.completed_at">
            <span class="label">完成时间</span>
            <span class="value">{{ formatDate(task.completed_at) }}</span>
          </div>
        </div>
      </div>

      <div class="actions" v-if="task.status === 'pending'">
        <van-button type="primary" block round @click="handleApply">
          我来完成
        </van-button>
      </div>

      <div class="actions" v-if="task.status === 'applying' && isExecutor">
        <van-button type="primary" block round @click="handleApprove">
          审核通过
        </van-button>
        <van-button plain block round @click="handleReject">
          审核拒绝
        </van-button>
      </div>
    </div>

    <van-loading v-else class="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { taskApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const task = ref<any>(null)

const isExecutor = computed(() => 
  task.value?.executor?.id === userStore.userId
)

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待执行',
    applying: '待审核',
    approved: '已完成',
    rejected: '已拒绝',
    expired: '已过期'
  }
  return map[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadTask = async () => {
  try {
    const res: any = await taskApi.detail(Number(route.params.id))
    task.value = res.data
  } catch {
    showToast('加载失败')
  }
}

const handleApply = async () => {
  try {
    await taskApi.apply(task.value.id)
    showSuccessToast('已提交申请')
    loadTask()
  } catch {
    showToast('操作失败')
  }
}

const handleApprove = async () => {
  try {
    await taskApi.approve(task.value.id)
    showSuccessToast('审核通过')
    loadTask()
  } catch {
    showToast('操作失败')
  }
}

const handleReject = async () => {
  try {
    await taskApi.reject(task.value.id)
    showSuccessToast('已拒绝')
    loadTask()
  } catch {
    showToast('操作失败')
  }
}

onMounted(() => {
  loadTask()
})
</script>

<style scoped>
.task-detail-container {
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

.content {
  padding: 16px;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.task-card h1 {
  font-size: 20px;
  margin-bottom: 12px;
}

.description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #999;
}

.info-item .value {
  font-size: 14px;
}

.info-item .points {
  color: #ff9800;
  font-weight: 600;
}

.info-item .status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.pending { background: #e3f2fd; color: #1976d2; }
.status.applying { background: #fff3e0; color: #f57c00; }
.status.approved { background: #e8f5e9; color: #388e3c; }

.actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>
