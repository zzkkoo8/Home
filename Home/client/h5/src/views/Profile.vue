<template>
  <div class="profile-container">
    <header class="header">
      <h2>个人中心</h2>
    </header>

    <div class="user-card">
      <div class="avatar">
        <img v-if="userStore.avatarUrl" :src="userStore.avatarUrl" alt="avatar" />
        <span v-else>{{ userStore.nickname?.charAt(0) || 'U' }}</span>
      </div>
      <div class="info">
        <h3>{{ userStore.nickname || '未设置昵称' }}</h3>
        <p>家庭: {{ userStore.familyName || '未加入' }}</p>
      </div>
    </div>

    <van-cell-group>
      <van-cell title="当前积分" :value="userStore.points + ' 积分'" is-link to="/points" />
      <van-cell title="积分商城" is-link to="/store" />
      <van-cell title="我的兑换记录" is-link to="/store" />
    </van-cell-group>

    <div class="logout-btn">
      <van-button type="danger" block plain @click="handleLogout">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  showToast('已退出')
  router.replace('/login')
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: white;
}

.header h2 {
  font-size: 18px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.info p {
  font-size: 14px;
  opacity: 0.9;
}

.logout-btn {
  margin: 24px 16px;
}
</style>
