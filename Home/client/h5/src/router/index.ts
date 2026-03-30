import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/family/create',
      name: 'FamilyCreate',
      component: () => import('../views/FamilyCreate.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/family/join',
      name: 'FamilyJoin',
      component: () => import('../views/FamilyJoin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task/create',
      name: 'TaskCreate',
      component: () => import('../views/TaskCreate.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/task/:id',
      name: 'TaskDetail',
      component: () => import('../views/TaskDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/points',
      name: 'Points',
      component: () => import('../views/Points.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/store',
      name: 'Store',
      component: () => import('../views/Store.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = localStorage.getItem('userId')
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
