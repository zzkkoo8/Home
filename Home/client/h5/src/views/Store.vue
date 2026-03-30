<template>
  <div class="store-container">
    <header class="header">
      <span class="back" @click="router.back()">&lt;</span>
      <h2>积分商城</h2>
      <span class="add-btn" v-if="isAdmin" @click="showAddReward = true">+添加</span>
    </header>

    <div class="reward-list">
      <div v-for="reward in rewards" :key="reward.id" class="reward-item">
        <div class="reward-info">
          <h3>{{ reward.name }}</h3>
          <p v-if="reward.description">{{ reward.description }}</p>
          <div class="reward-meta">
            <span class="price">{{ reward.points_price }}积分</span>
            <span class="stock">库存: {{ reward.stock }}</span>
          </div>
        </div>
        <van-button 
          size="small" 
          type="primary" 
          :disabled="reward.stock <= 0 || userStore.points < reward.points_price"
          @click="handleExchange(reward)"
        >
          兑换
        </van-button>
      </div>
      <van-empty v-if="rewards.length === 0" description="暂无奖励" />
    </div>

    <van-popup v-model:show="showAddReward" position="bottom" round>
      <div class="add-form">
        <h3>添加奖励</h3>
        <van-form @submit="handleAddReward">
          <van-cell-group inset>
            <van-field v-model="rewardForm.name" name="name" label="名称" placeholder="奖励名称" />
            <van-field v-model="rewardForm.description" name="description" label="描述" placeholder="奖励描述" />
            <van-field v-model.number="rewardForm.points_price" name="points_price" label="积分" type="number" placeholder="所需积分" />
            <van-field v-model.number="rewardForm.stock" name="stock" label="库存" type="number" placeholder="库存数量" />
          </van-cell-group>
          <div class="submit-btn">
            <van-button type="primary" block round native-type="submit">添加</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showDialog } from 'vant'
import { rewardApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const rewards = ref<any[]>([])
const showAddReward = ref(false)
const isAdmin = computed(() => true)

const rewardForm = reactive({
  name: '',
  description: '',
  points_price: 0,
  stock: 0
})

const loadRewards = async () => {
  try {
    const res: any = await rewardApi.list()
    rewards.value = res.data
  } catch {
    showToast('加载失败')
  }
}

const handleExchange = async (reward: any) => {
  showDialog({
    title: '确认兑换',
    message: `确定要用 ${reward.points_price} 积分兑换 "${reward.name}" 吗？`,
    showCancelButton: true,
  }).then(async () => {
    try {
      await rewardApi.exchange(reward.id)
      showSuccessToast('兑换成功')
      loadRewards()
    } catch (e: any) {
      showToast(e.message || '兑换失败')
    }
  }).catch(() => {})
}

const handleAddReward = async () => {
  try {
    await rewardApi.create({
      family_id: userStore.familyId!,
      ...rewardForm
    })
    showSuccessToast('添加成功')
    showAddReward.value = false
    loadRewards()
  } catch {
    showToast('添加失败')
  }
}

onMounted(() => {
  loadRewards()
})
</script>

<style scoped>
.store-container {
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
  flex: 1;
  font-size: 18px;
}

.add-btn {
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
}

.reward-list {
  padding: 12px;
}

.reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.reward-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.reward-info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.reward-meta {
  display: flex;
  gap: 12px;
}

.price {
  color: #ff9800;
  font-weight: 600;
}

.stock {
  color: #999;
  font-size: 12px;
}

.add-form {
  padding: 20px;
}

.add-form h3 {
  text-align: center;
  margin-bottom: 16px;
}

.submit-btn {
  margin-top: 20px;
  padding: 0 16px;
}
</style>
