import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'
import ProductManagement from '../views/ProductManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
    },
    {
      path: '/products',
      name: 'products',
      component: ProductManagement,
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
