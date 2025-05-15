import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/components/Auth.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/components/Account.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.user) {
    return { name: 'auth' }
  }
  
  if (to.name === 'auth' && userStore.user) {
    return { name: 'home' }
  }
})

export default router
