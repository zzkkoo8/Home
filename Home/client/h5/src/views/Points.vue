<template>
  <div class="points-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>积分中心</h2>
    </header>

    <div class="balance-card">
      <span class="label">我的积分</span>
      <span class="value">{{ userStore.points }}</span>
    </div>

    <van-tabs v-model:active="activeTab">
      <van-tab title="积分明细" name="logs">
        <div class="log-list">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <div class="log-info">
              <span class="reason">{{ log.reason || '积分变动' }}</span>
              <span class="time">{{ formatDate(log.created_at) }}</span>
            </div>
            <span class="amount" :class="log.amount > 0 ? 'positive' : 'negative'">
              {{ log.amount > 0 ? '+' : '' }}{{ log.amount }}
            </span>
          </div>
          <van-empty v-if="logs.length === 0" description="暂无积分记录" />
        </div>
      </van-tab>
      <van-tab title="家庭排行" name="ranking">
        <div class="ranking-list">
          <div v-for="(member, index) in ranking" :key="member.user_id" class="rank-item">
            <div class="rank-info">
              <span class="rank-num" :class="getRankClass(index)">{{ index + 1 }}</span>
              <span class="nickname">{{ member.nickname }}</span>
            </div>
            <span class="points">{{ member.points }}积分</span>
          </div>
          <van-empty v-if="ranking.length === 0" description="暂无排行数据" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { pointsApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('logs')
const logs = ref<any[]>([])
const ranking = ref<any[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getRankClass = (index: number) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

const loadLogs = async () => {
  try {
    const res: any = await pointsApi.logs()
    logs.value = res.data
  } catch {
    showToast('加载失败')
  }
}

const loadRanking = async () => {
  try {
    const res: any = await pointsApi.ranking()
    ranking.value = res.data
  } catch {
    showToast('加载失败')
  }
}

onMounted(() => {
  loadLogs()
  loadRanking()
})
</script>

<style scoped>
.points-container {
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

.balance-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.balance-card .label {
  font-size: 14px;
  opacity: 0.9;
}

.balance-card .value {
  font-size: 48px;
  font-weight: 700;
  margin-top: 8px;
}

.log-list, .ranking-list {
  padding: 12px;
}

.log-item, .rank-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.log-info {
  display: flex;
  flex-direction: column;
}

.log-info .reason {
  font-size: 14px;
}

.log-info .time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.amount {
  font-size: 16px;
  font-weight: 600;
}

.amount.positive { color: #ff9800; }
.amount.negative { color: #666; }

.rank-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  background: #e0e0e0;
  color: #666;
}

.rank-num.gold { background: #ffd700; color: #8b6914; }
.rank-num.silver { background: #c0c0c0; color: #666; }
.rank-num.bronze { background: #cd7f32; color: #fff; }

.nickname {
  font-size: 14px;
}

.ranking-list .points {
  color: #ff9800;
  font-weight: 500;
}
</style>
