<template>
  <div class="home-container">
    <header class="header">
      <div class="family-info" @click="showFamilyMenu = true">
        <span class="family-name">{{ userStore.familyName || '未加入家庭' }}</span>
        <span class="invite-code" v-if="userStore.inviteCode">邀请码: {{ userStore.inviteCode }}</span>
      </div>
      <div class="points-display" @click="router.push('/points')">
        <span class="points-value">{{ userStore.points }}</span>
        <span class="points-label">积分</span>
      </div>
    </header>

    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="任务" name="tasks">
        <div class="task-list">
          <div 
            v-for="task in tasks" 
            :key="task.id" 
            class="task-item"
            @click="router.push(`/task/${task.id}`)"
          >
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p v-if="task.description">{{ task.description }}</p>
              <div class="task-meta">
                <span class="points">+{{ task.points }}积分</span>
                <span class="status" :class="task.status">{{ getStatusText(task.status) }}</span>
              </div>
            </div>
            <div class="task-creator">
              <span>by {{ task.creator?.nickname || '未知' }}</span>
            </div>
          </div>
          <van-empty v-if="tasks.length === 0" description="暂无任务" />
        </div>
      </van-tab>
      <van-tab title="待审核" name="pending">
        <div class="task-list">
          <div 
            v-for="task in pendingTasks" 
            :key="task.id" 
            class="task-item pending"
            @click="router.push(`/task/${task.id}`)"
          >
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p v-if="task.description">{{ task.description }}</p>
              <div class="task-meta">
                <span class="points">+{{ task.points }}积分</span>
                <span class="status applying">待审核</span>
              </div>
            </div>
            <div class="task-executor">
              <span>申请者: {{ task.executor?.nickname || '未知' }}</span>
            </div>
          </div>
          <van-empty v-if="pendingTasks.length === 0" description="暂无待审核任务" />
        </div>
      </van-tab>
    </van-tabs>

    <van-action-sheet v-model:show="showFamilyMenu" :actions="familyActions" @select="onFamilyAction" />

    <van-action-bar>
      <van-action-bar-icon icon="plus" @click="router.push('/task/create')" />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { taskApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('tasks')
const showFamilyMenu = ref(false)
const tasks = ref<any[]>([])

const pendingTasks = computed(() => 
  tasks.value.filter(t => t.status === 'applying')
)

const familyActions = computed(() => {
  if (!userStore.familyId) {
    return [
      { name: '创建家庭', action: () => router.push('/family/create') },
      { name: '加入家庭', action: () => router.push('/family/join') }
    ]
  }
  return [
    { name: '邀请码: ' + userStore.inviteCode, disabled: true },
    { name: '成员排行', action: () => router.push('/points') },
    { name: '离开家庭', color: '#ee0a24', action: handleLeaveFamily }
  ]
})

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

const onTabChange = () => {
  loadTasks()
}

const loadTasks = async () => {
  try {
    const res: any = await taskApi.list()
    tasks.value = res.data
  } catch {
    showToast('加载任务失败')
  }
}

const onFamilyAction = (action: any) => {
  if (action.action) {
    action.action()
  }
}

const handleLeaveFamily = async () => {
  showFamilyMenu.value = false
  try {
    await taskApi.list()
  } catch {
    showToast('操作失败')
  }
}

onMounted(() => {
  if (!userStore.familyId) {
    router.push('/family/create')
    return
  }
  loadTasks()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.family-info {
  display: flex;
  flex-direction: column;
}

.family-name {
  font-size: 18px;
  font-weight: 600;
}

.invite-code {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.points-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.points-value {
  font-size: 24px;
  font-weight: 700;
}

.points-label {
  font-size: 12px;
  opacity: 0.8;
}

.task-list {
  padding: 12px;
}

.task-item {
  background: white;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
  cursor: pointer;
}

.task-info h3 {
  font-size: 16px;
  margin-bottom: 6px;
}

.task-info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.points {
  color: #ff9800;
  font-weight: 500;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.pending { background: #e3f2fd; color: #1976d2; }
.status.applying { background: #fff3e0; color: #f57c00; }
.status.approved { background: #e8f5e9; color: #388e3c; }
.status.rejected { background: #ffebee; color: #d32f2f; }
.status.expired { background: #f5f5f5; color: #9e9e9e; }

.task-creator, .task-executor {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}
</style>
