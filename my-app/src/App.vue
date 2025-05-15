<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser()
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      <template #fallback>
        <div class="loading">
          Loading...
        </div>
      </template>
    </Suspense>
  </RouterView>
</template>

<style lang="scss">
$primary: #00ff88;
$secondary: #00ffff;
$white: #fff;
$dark-bg: #18181b;

:root {
  --primary-color: #{$primary};
  --secondary-color: #{$secondary};
  --background-color: #{$dark-bg};
  --text-color: #{$white};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: $dark-bg;
  color: $white;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', sans-serif;
}

a {
  color: $primary;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: $secondary;
  }
}

button {
  cursor: pointer;
  font-family: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.gradient-text {
  background: linear-gradient(45deg, $primary, $secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;

  &-primary {
    background: linear-gradient(45deg, $primary, $secondary);
    color: #000;
    border: none;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &-secondary {
    background: transparent;
    border: 1px solid $primary;
    color: $primary;

    &:hover {
      background: $primary;
      color: #000;
    }
  }
}

.section {
  padding: 4rem 0;

  &-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 2rem 0;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>