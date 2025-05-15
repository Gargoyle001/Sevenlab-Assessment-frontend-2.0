<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function goToAccount() {
  router.push('/account')
}
</script>

<template>
  <main class="home">
    <h1>Welcome {{ userStore.user?.email }}</h1>
    <div class="content">
      <p>You are now signed in to your account.</p>
      <button @click="goToAccount" class="account-button">
        Manage Account
      </button>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.content {
  text-align: center;
}

.account-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #00dc82;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.account-button:hover {
  background-color: #00b76b;
}
</style>
