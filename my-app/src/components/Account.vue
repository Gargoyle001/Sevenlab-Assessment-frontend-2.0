<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/lib/supabase'

const userStore = useUserStore()
const loading = ref(false)
const username = ref('')
const website = ref('')
const avatarUrl = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    const { user } = userStore
    if (!user) throw new Error('No user')

    const { data, error } = await supabase
      .from('profiles')
      .select('username, website, avatar_url')
      .eq('id', user.id)
      .single()

    if (error) throw error

    if (data) {
      username.value = data.username
      website.value = data.website
      avatarUrl.value = data.avatar_url
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const { user } = userStore
    if (!user) throw new Error('No user')

    const updates = {
      id: user.id,
      username: username.value,
      website: website.value,
      avatar_url: avatarUrl.value,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)
    if (error) throw error
    alert('Profile updated!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Error updating profile!')
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    await userStore.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="account-container">
    <form @submit.prevent="updateProfile" class="account-form">
      <h1>Profile</h1>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="text" :value="userStore.user?.email" disabled />
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="Your username"
        />
      </div>

      <div class="form-group">
        <label for="website">Website</label>
        <input
          id="website"
          type="url"
          v-model="website"
          placeholder="Your website"
        />
      </div>

      <div class="button-group">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Update Profile' }}
        </button>

        <button type="button" class="button-secondary" @click="signOut">
          Sign Out
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.account-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f3f4f6;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #00dc82;
  color: white;
}

.button-secondary {
  background-color: #ef4444;
  color: white;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 