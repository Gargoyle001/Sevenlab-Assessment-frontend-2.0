<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isSignUp = ref(false)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null
    
    if (isSignUp.value) {
      await userStore.signUp(email.value, password.value)
      alert('Check your email for the confirmation link!')
    } else {
      await userStore.signIn(email.value, password.value)
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h1>{{ isSignUp ? 'Sign Up' : 'Sign In' }}</h1>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="Your email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Your password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
      </button>

      <p class="toggle-auth">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <a href="#" @click.prevent="isSignUp = !isSignUp">
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </a>
      </p>
    </form>
  </div>
</template>

<style lang="scss" scoped>
$primary: #00dc82;
$primary-light: #a8e5ce;
$danger: #dc2626;
$danger-bg: #fee2e2;
$gray: #2c3e50;

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;

  .auth-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: $gray;
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: $gray;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: $primary;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      &:disabled {
        background-color: $primary-light;
        cursor: not-allowed;
      }
    }

    .error-message {
      color: $danger;
      background-color: $danger-bg;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .toggle-auth {
      text-align: center;
      margin-top: 1rem;
      a {
        color: $primary;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style> 