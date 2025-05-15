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

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.account {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 2rem;
  }

  .account-content {
    background: $dark-bg;
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid $border-color;

    .user-info {
      margin-bottom: 2rem;

      h2 {
        color: $white;
        margin-bottom: 1rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;

        .info-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid $border-color;

          .label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .value {
            color: $white;
            font-weight: 500;
          }
        }
      }
    }

    .orders-section {
      h2 {
        color: $white;
        margin-bottom: 1rem;
      }

      .order-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .order-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid $border-color;

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;

            .order-id {
              color: $primary;
              font-weight: 600;
            }

            .order-date {
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.9rem;
            }
          }

          .order-items {
            margin-bottom: 1rem;

            .item {
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 0;
              border-bottom: 1px solid $border-color;

              &:last-child {
                border-bottom: none;
              }

              .item-name {
                color: $white;
              }

              .item-price {
                color: $secondary;
              }
            }
          }

          .order-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid $border-color;

            .total-label {
              color: $white;
              font-weight: 600;
            }

            .total-amount {
              color: $primary;
              font-size: 1.2rem;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .account {
    padding: 1rem;

    h1 {
      font-size: 2rem;
    }

    .account-content {
      padding: 1rem;
    }
  }
}
</style> 