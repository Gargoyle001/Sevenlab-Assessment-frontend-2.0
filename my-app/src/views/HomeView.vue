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

<style lang="scss" scoped>
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: rgba(255, 255, 255, 0.05);
$border-color: rgba(255, 255, 255, 0.1);

.home-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: $primary;
    margin-bottom: 2rem;
    text-align: center;
  }

  .welcome-message {
    text-align: center;
    margin-bottom: 3rem;

    p {
      color: $white;
      font-size: 1.2rem;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;

    .action-card {
      background: $dark-bg;
      padding: 2rem;
      border-radius: 15px;
      border: 1px solid $border-color;
      text-align: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .icon {
        font-size: 2.5rem;
        color: $primary;
        margin-bottom: 1rem;
      }

      h3 {
        color: $white;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .action-button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(45deg, $primary, $secondary);
        border: none;
        border-radius: 25px;
        color: #000;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }
    }
  }

  .recent-activity {
    background: $dark-bg;
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid $border-color;

    h2 {
      color: $white;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid $border-color;

        .activity-icon {
          font-size: 1.5rem;
          color: $primary;
        }

        .activity-content {
          flex: 1;

          h4 {
            color: $white;
            margin-bottom: 0.25rem;
          }

          p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
          }
        }

        .activity-time {
          color: $secondary;
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-view {
    padding: 1rem;

    h1 {
      font-size: 2rem;
    }

    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
}
</style>
